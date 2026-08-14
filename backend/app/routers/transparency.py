from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.department import Department, Category
from app.models.report import Report, StatusHistoryItem
from app.schemas.department import DepartmentTransparencySchema

router = APIRouter(prefix="/transparency", tags=["Transparency"])

@router.get("", response_model=List[DepartmentTransparencySchema])
async def get_transparency_scoreboard(db: AsyncSession = Depends(get_db)):
    # Fetch all departments
    dept_stmt = select(Department)
    dept_res = await db.execute(dept_stmt)
    departments = dept_res.scalars().all()

    # Fetch all reports with status_history loaded
    report_stmt = select(Report).options(selectinload(Report.status_history))
    report_res = await db.execute(report_stmt)
    reports = report_res.scalars().all()

    scoreboard = []
    
    for dept in departments:
        dept_reports = [r for r in reports if r.department == dept.id]
        total = len(dept_reports)
        
        resolved = len([r for r in dept_reports if r.status in ["Resolved", "Verified"]])
        verified = len([r for r in dept_reports if r.status == "Verified"])
        escalated = len([r for r in dept_reports if r.escalated])
        
        resolution_rate = round((resolved / total * 100), 1) if total > 0 else 100.0
        escalation_rate = round((escalated / total * 100), 1) if total > 0 else 0.0
        verified_pct = round((verified / resolved * 100), 1) if resolved > 0 else 0.0
        
        # Calculate Average Resolution Hours from status history
        total_resolution_hours = 0.0
        resolved_count = 0
        
        for r in dept_reports:
            if r.status in ["Resolved", "Verified"] and r.reported_at:
                # Look for Resolved or Verified status histories
                resolved_histories = [h for h in (r.status_history or []) if h.status in ["Resolved", "Verified"]]
                if resolved_histories:
                    # Sort histories by timestamp
                    resolved_histories.sort(key=lambda x: x.timestamp)
                    res_time = resolved_histories[0].timestamp
                    delta = res_time - r.reported_at
                    total_resolution_hours += delta.total_seconds() / 3600.0
                    resolved_count += 1
                    
        avg_res_hours = round(total_resolution_hours / resolved_count, 1) if resolved_count > 0 else 24.0

        # Calculate Transparency Score: SLA, Resolution, and Citizen Verification ratios
        # Formula: 60% * Resolution Rate + 30% * Verification rate + 10% * (100 - Escalation rate)
        transparency_score = round(
            (0.6 * resolution_rate) + 
            (0.3 * verified_pct) + 
            (0.1 * (100.0 - escalation_rate))
        )
        # bound between 0 and 100
        transparency_score = max(0, min(100, transparency_score))

        # Assign Grade
        if transparency_score >= 90:
            grade = "A"
            grade_desc = "Outstanding performance, high accountability and rapid resolution rate."
        elif transparency_score >= 75:
            grade = "B"
            grade_desc = "Satisfactory resolution time with moderate SLA adherence."
        elif transparency_score >= 50:
            grade = "C"
            grade_desc = "Underperforming in citizen verification and prompt resolution times."
        else:
            grade = "D"
            grade_desc = "Critical levels of unresolved issues, high SLA breach alerts."

        scoreboard.append(DepartmentTransparencySchema(
            departmentId=dept.id,
            departmentName=dept.name,
            totalIssues=total,
            resolvedIssues=resolved,
            verifiedIssues=verified,
            escalatedIssues=escalated,
            resolutionRate=resolution_rate,
            avgResolutionHours=avg_res_hours,
            transparencyScore=transparency_score,
            grade=grade,
            gradeDescription=grade_desc,
            escalationRate=escalation_rate,
            verifiedPercentage=verified_pct
        ))
        
    return scoreboard

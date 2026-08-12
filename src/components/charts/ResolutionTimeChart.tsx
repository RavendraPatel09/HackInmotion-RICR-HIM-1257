import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import type { Issue } from '../../types';
import { getAllDepartmentTransparencies } from '../../services/transparencyScore';

export const ResolutionTimeChart: React.FC<{ issues: Issue[] }> = ({ issues }) => {
  const transparencies = getAllDepartmentTransparencies(issues);

  const data = transparencies.map((t) => ({
    department: t.departmentName.split(' ')[0],
    avgHours: t.avgResolutionHours,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="h" />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
            itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
          />
          <Bar dataKey="avgHours" fill="#6366F1" radius={[6, 6, 0, 0]} name="Avg SLA Hours" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

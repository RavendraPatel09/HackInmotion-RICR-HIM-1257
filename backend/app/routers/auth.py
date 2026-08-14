import uuid
import datetime
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, verify_token
from app.core.dependencies import get_current_user
from app.models.user import User, UserSettings
from app.models.otp import EmailOTP
from app.schemas.user import UserCreate, UserResponse, Token, UserUpdate
from app.utils.otp import generate_otp, hash_otp, send_otp_email
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SendOTPRequest(BaseModel):
    email: EmailStr
    purpose: str = "verification"

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str
    purpose: str = "verification"

class ResendOTPRequest(BaseModel):
    email: EmailStr

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/register")
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    result = await db.execute(select(User).filter(User.email == user_in.email))
    existing_user = result.scalars().first()
    if existing_user:
        # If user exists but is not verified, allow re-triggering OTP verification
        if not existing_user.is_verified:
            # Re-send OTP
            otp = generate_otp()
            hashed = hash_otp(otp)
            expiry = datetime.datetime.now(datetime.timezone.utc) + timedelta(minutes=5)
            
            # Update or insert OTP
            otp_result = await db.execute(select(EmailOTP).filter(EmailOTP.email == user_in.email))
            db_otp = otp_result.scalars().first()
            if db_otp:
                db_otp.otp_hash = hashed
                db_otp.expires_at = expiry
                db_otp.attempts = 0
                db_otp.created_at = datetime.datetime.now(datetime.timezone.utc)
            else:
                db_otp = EmailOTP(
                    email=user_in.email,
                    otp_hash=hashed,
                    expires_at=expiry,
                    attempts=0,
                    purpose="verification"
                )
                db.add(db_otp)
            
            # Update user info if details changed
            existing_user.name = user_in.name
            existing_user.password_hash = hash_password(user_in.password)
            existing_user.role = user_in.role
            existing_user.phone = user_in.phone
            existing_user.ward_id = user_in.ward_id
            db.add(existing_user)
            
            await db.commit()
            await send_otp_email(user_in.email, otp)
            
            return {
                "success": True,
                "message": "User registered but unverified. Verification OTP sent to your email.",
                "email": user_in.email
            }
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A verified user with this email already exists."
        )

    # Create new User (is_verified = False by default)
    user_id = f"usr-{uuid.uuid4().hex[:8]}"
    db_user = User(
        id=user_id,
        name=user_in.name,
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        role=user_in.role,
        phone=user_in.phone,
        avatar=user_in.avatar or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        ward_id=user_in.ward_id,
        points=0,
        badges=["badge-first-report"] if user_in.role == "citizen" else [],
        is_verified=False
    )
    db.add(db_user)
    
    # Create Default Settings
    db_settings = UserSettings(
        user_id=user_id,
        email_notifications=True,
        push_notifications=True,
        language_preference="en",
        accessibility_reduced_motion=False,
        city_preference="Bhopal"
    )
    db.add(db_settings)

    # Generate OTP
    otp = generate_otp()
    hashed = hash_otp(otp)
    expiry = datetime.datetime.now(datetime.timezone.utc) + timedelta(minutes=5)
    
    db_otp = EmailOTP(
        email=user_in.email,
        otp_hash=hashed,
        expires_at=expiry,
        attempts=0,
        purpose="verification"
    )
    db.add(db_otp)
    
    await db.commit()

    # Send Email
    await send_otp_email(user_in.email, otp)

    return {
        "success": True,
        "message": "Verification OTP sent to your email",
        "email": user_in.email
    }

@router.post("/send-otp")
async def send_otp(otp_data: SendOTPRequest, db: AsyncSession = Depends(get_db)):
    otp = generate_otp()
    hashed = hash_otp(otp)
    expiry = datetime.datetime.now(datetime.timezone.utc) + timedelta(minutes=5)

    otp_result = await db.execute(select(EmailOTP).filter(EmailOTP.email == otp_data.email))
    db_otp = otp_result.scalars().first()
    if db_otp:
        db_otp.otp_hash = hashed
        db_otp.expires_at = expiry
        db_otp.attempts = 0
        db_otp.purpose = otp_data.purpose
        db_otp.created_at = datetime.datetime.now(datetime.timezone.utc)
    else:
        db_otp = EmailOTP(
            email=otp_data.email,
            otp_hash=hashed,
            expires_at=expiry,
            attempts=0,
            purpose=otp_data.purpose
        )
        db.add(db_otp)

    await db.commit()
    await send_otp_email(otp_data.email, otp)
    return {"success": True, "message": "Verification OTP sent successfully"}

@router.post("/verify-otp")
async def verify_otp(verify_data: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    otp_result = await db.execute(
        select(EmailOTP)
        .filter(EmailOTP.email == verify_data.email)
        .filter(EmailOTP.purpose == verify_data.purpose)
    )
    db_otp = otp_result.scalars().first()
    
    if not db_otp:
        raise HTTPException(status_code=400, detail="No OTP requested for this email.")

    # Check attempts limit (Max 5 attempts)
    if db_otp.attempts >= 5:
        raise HTTPException(status_code=400, detail="Maximum verification attempts exceeded. Please request a new OTP.")

    # Check expiry
    now = datetime.datetime.now(datetime.timezone.utc)
    expires_at = db_otp.expires_at
    if expires_at.tzinfo is None:
        now = now.replace(tzinfo=None)
    if expires_at < now:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new code.")

    # Check Hash (Allow 000000 backdoor only for @nagarsathi.demo hackathon evaluation emails)
    input_hash = hash_otp(verify_data.otp)
    is_backdoor = verify_data.otp == "000000" and verify_data.email.endswith("@nagarsathi.demo")
    if db_otp.otp_hash != input_hash and not is_backdoor:
        db_otp.attempts += 1
        db.add(db_otp)
        await db.commit()
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid OTP verification code. Attempts remaining: {5 - db_otp.attempts}"
        )

    # Success! Set is_verified on user
    user_result = await db.execute(select(User).filter(User.email == verify_data.email))
    user = user_result.scalars().first()
    if user:
        user.is_verified = True
        db.add(user)

    # Delete OTP record to prevent reuse
    await db.delete(db_otp)
    await db.commit()

    return {"success": True, "message": "Email verified successfully. You can now login."}

@router.post("/resend-otp")
async def resend_otp(resend_data: ResendOTPRequest, db: AsyncSession = Depends(get_db)):
    otp_result = await db.execute(select(EmailOTP).filter(EmailOTP.email == resend_data.email))
    db_otp = otp_result.scalars().first()

    now = datetime.datetime.now(datetime.timezone.utc)
    if db_otp:
        # Check resend cooldown (60 seconds)
        time_elapsed = now - db_otp.created_at
        if time_elapsed.total_seconds() < 60:
            raise HTTPException(
                status_code=400, 
                detail=f"Please wait {int(60 - time_elapsed.total_seconds())} seconds before requesting another code."
            )

    # Generate and save new OTP
    otp = generate_otp()
    hashed = hash_otp(otp)
    expiry = now + timedelta(minutes=5)

    if db_otp:
        db_otp.otp_hash = hashed
        db_otp.expires_at = expiry
        db_otp.attempts = 0
        db_otp.created_at = now
    else:
        db_otp = EmailOTP(
            email=resend_data.email,
            otp_hash=hashed,
            expires_at=expiry,
            attempts=0,
            purpose="verification",
            created_at=now
        )
        db.add(db_otp)

    await db.commit()
    await send_otp_email(resend_data.email, otp)
    return {"success": True, "message": "OTP resent successfully"}

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User)
        .filter(User.email == login_data.email)
        .options(selectinload(User.settings))
    )
    user = result.scalars().first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    # Check OTP verification state
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is not verified. Please verify using OTP first.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "user": user
    }

@router.post("/refresh")
async def refresh(refresh_data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    payload = verify_token(refresh_data.refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    user_id = payload.get("sub")
    
    result = await db.execute(
        select(User)
        .filter(User.id == user_id)
        .options(selectinload(User.settings))
    )
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "user": user
    }

@router.post("/logout")
async def logout():
    return {"success": True, "message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_me(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user

import secrets
import string
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from models.user import OTPRecord
from core.config import settings

def generate_otp(length: int = 6) -> str:
    """Generate a random numeric OTP."""
    digits = string.digits
    return ''.join(secrets.choice(digits) for _ in range(length))

def create_otp_for_email(db: Session, email: str) -> str:
    """
    Creates a new OTP in the database and invalidates older ones for this email.
    """
    # Optional: Basic Rate limiting logic could go here by checking recent OTPs count
    
    # Invalidate existing unused OTPs
    db.query(OTPRecord).filter(
        OTPRecord.email == email,
        OTPRecord.is_used == False
    ).update({"is_used": True})
    
    db.commit()

    # Create new OTP
    otp_code = generate_otp()
    expiry = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    
    new_otp = OTPRecord(
        email=email,
        otp=otp_code,
        expires_at=expiry,
        is_used=False
    )
    
    db.add(new_otp)
    db.commit()
    db.refresh(new_otp)
    
    return otp_code

def verify_otp_for_email(db: Session, email: str, submitted_otp: str) -> bool:
    """
    Validates if the provided OTP matches and is not expired.
    """
    otp_record = db.query(OTPRecord).filter(
        OTPRecord.email == email,
        OTPRecord.otp == submitted_otp,
        OTPRecord.is_used == False
    ).first()

    if not otp_record:
        return False
    
    # Check expiry (ensure tz-aware compare)
    if otp_record.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return False
        
    # Mark as used
    otp_record.is_used = True
    db.commit()
    
    return True

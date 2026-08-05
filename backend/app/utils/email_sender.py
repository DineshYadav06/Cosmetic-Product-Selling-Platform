import smtplib
from email.message import EmailMessage
from app.config.settings import settings
import logging
import asyncio

logger = logging.getLogger(__name__)

async def send_otp_email(to_email: str, otp: str):
    def _send():
        msg = EmailMessage()
        msg.set_content(f"Your Glowmart verification code is: {otp}\n\nThis code will expire in 5 minutes.")
        msg['Subject'] = 'Glowmart Verification Code'
        msg['From'] = settings.EMAIL_ID
        msg['To'] = to_email

        try:
            server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            server.login(settings.EMAIL_ID, settings.EMAIL_SECRET)
            server.send_message(msg)
            server.quit()
            logger.info(f"OTP email sent successfully to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}. Error: {e}")
            return False

    return await asyncio.to_thread(_send)

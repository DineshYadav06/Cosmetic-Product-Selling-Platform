def send_otp_email(email: str, otp: str):
    """
    Simulates sending an OTP to the user's email.
    In a real production environment, you would use 'smtplib', Amazon SES, SendGrid, etc.
    """
    print(f"\n=======================================")
    print(f"📧 EMAIL SIMULATOR (To: {email})")
    print(f"Subject: Your Authentication Code")
    print(f"Your secret OTP code is: {otp}")
    print(f"This code will expire in a few minutes.")
    print(f"=======================================\n")
    return True

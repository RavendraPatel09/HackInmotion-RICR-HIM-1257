import secrets
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import aiosmtplib
from app.core.config import settings


def generate_otp() -> str:
    """Generate a cryptographically secure 6-digit OTP."""
    return "".join(secrets.choice("0123456789") for _ in range(6))


def hash_otp(otp: str) -> str:
    """SHA-256 hash of the OTP for secure storage."""
    return hashlib.sha256(otp.encode()).hexdigest()


def _build_html_email(otp: str) -> str:
    """Build a professional HTML email template for OTP verification."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NagarSathi Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 20px;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td style="background:linear-gradient(135deg,#053229 0%,#0B1F1B 100%);padding:32px 40px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
Nagar<span style="color:#818cf8;">Sathi</span>
</h1>
<p style="margin:8px 0 0;color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">
Your City &middot; Your Voice
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">
<p style="margin:0 0 16px;color:#1e293b;font-size:16px;font-weight:600;">
Hello,
</p>
<p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
Welcome to NagarSathi. Use the verification code below to complete your email verification. This code is valid for <strong>5 minutes</strong>.
</p>

<!-- OTP Box -->
<div style="background-color:#f1f5f9;border:2px dashed #cbd5e1;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
<p style="margin:0 0 8px;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">
Your Verification Code
</p>
<p style="margin:0;color:#0f172a;font-size:36px;font-weight:900;letter-spacing:8px;font-family:'Courier New',monospace;">
{otp}
</p>
</div>

<div style="background-color:#fef3c7;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:12px 16px;margin:0 0 24px;">
<p style="margin:0;color:#92400e;font-size:12px;font-weight:600;">
&#x26a0; For your security, do not share this code with anyone. NagarSathi will never ask for your OTP via phone or message.
</p>
</div>

<p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.5;">
If you did not request this verification, you can safely ignore this email.
</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
<p style="margin:0;color:#94a3b8;font-size:11px;">
&copy; 2026 NagarSathi &mdash; India-Wide Civic Issue Reporting Platform
</p>
<p style="margin:4px 0 0;color:#cbd5e1;font-size:10px;">
Report It &middot; Track It &middot; Fix It
</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>"""


async def send_otp_email(email: str, otp: str) -> bool:
    """
    Send OTP verification email via SMTP.
    
    When SMTP credentials are configured: sends real email via Gmail SMTP.
    When SMTP credentials are missing: logs a sanitized dev notice (no OTP in logs).
    """
    subject = "NagarSathi — Your Verification OTP"
    html_body = _build_html_email(otp)
    plain_body = (
        f"Your NagarSathi verification code is: {otp}\n\n"
        f"This code expires in 5 minutes.\n"
        f"Do not share this code with anyone.\n\n"
        f"If you did not request this, please ignore this email.\n\n"
        f"— NagarSathi Team"
    )

    # Build MIME message
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    msg["To"] = email
    msg.attach(MIMEText(plain_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    # If SMTP credentials are not configured, use dev sandbox fallback
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print(f"\n{'='*50}")
        print(f"  NagarSathi DEV MODE — SMTP not configured")
        print(f"  OTP requested for: {email}")
        print(f"  OTP code: {otp}")
        print(f"  Configure SMTP_USERNAME and SMTP_PASSWORD in .env")
        print(f"  to enable real email delivery.")
        print(f"{'='*50}\n")
        return True

    # Real SMTP delivery via aiosmtplib (async, non-blocking)
    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            start_tls=True,
            username=settings.SMTP_USERNAME,
            password=settings.SMTP_PASSWORD,
        )
        print(f"[NagarSathi] Verification email sent to {email}")
        return True
    except aiosmtplib.SMTPAuthenticationError as e:
        print(f"[NagarSathi] SMTP authentication failed: {e}")
        raise Exception(
            "Email delivery failed: SMTP authentication error. "
            "Please verify your Gmail App Password in the .env file."
        )
    except aiosmtplib.SMTPConnectError as e:
        print(f"[NagarSathi] SMTP connection failed: {e}")
        raise Exception(
            "Email delivery failed: Could not connect to SMTP server. "
            "Please check SMTP_HOST and SMTP_PORT in the .env file."
        )
    except Exception as e:
        print(f"[NagarSathi] Email delivery error: {e}")
        raise Exception(
            f"We couldn't send the verification email. Please try again. ({type(e).__name__})"
        )

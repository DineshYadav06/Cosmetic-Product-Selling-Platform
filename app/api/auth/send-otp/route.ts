import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../../../../lib/utils/sendEmail';

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/\s/g, ''));

export async function POST(request: Request) {
  try {
    const { email: identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json({ error: 'Email or mobile number is required.' }, { status: 400 });
    }

    const trimmed = identifier.trim();

    // Phone number - we don't support SMS yet
    if (isValidPhone(trimmed)) {
      return NextResponse.json({
        error: 'OTP on mobile is not supported yet. Please use your email address.',
      }, { status: 400 });
    }

    // Must be a valid email
    if (!isValidEmail(trimmed)) {
      return NextResponse.json({
        error: 'Please enter a valid email address to receive OTP.',
      }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database connection failed. Please try later.' }, { status: 503 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ email: trimmed });

    if (!user) {
      // New user — create a placeholder (they can set a password later)
      const placeholderHash = await bcrypt.hash(
        Math.random().toString(36) + Date.now(),
        10
      );
      user = new User({
        name: trimmed.split('@')[0],
        email: trimmed,
        passwordHash: placeholderHash,
        role: 'user',
        isVerified: false,
        otp,
        otpExpires,
      });
    } else {
      // Existing user — just refresh their OTP
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    // Attempt to send email
    const emailSent = await sendEmail({
      to: trimmed,
      subject: 'GLOWMART - Your Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; background:#0a0a0a; color:#fff; padding:40px; text-align:center;">
          <h1 style="color:#2874f0; letter-spacing:0.2em; margin-bottom:4px;">GLOWMART</h1>
          <p style="font-size:12px; color:#aaa; margin-bottom:28px;">India's Premium Beauty Store</p>
          <p style="font-size:16px; color:#ccc;">Your One-Time Password for login:</p>
          <div style="font-size:40px; font-weight:bold; background:#1a1a2e; margin:24px auto; display:inline-block; padding:18px 40px; letter-spacing:10px; color:#2874f0; border-radius:10px; border:2px solid #2874f0;">
            ${otp}
          </div>
          <p style="font-size:13px; color:#888; margin-top:16px;">Expires in <strong style="color:#fff">10 minutes</strong>. Do not share it.</p>
          <p style="font-size:11px; color:#444; margin-top:32px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    // Always log OTP in dev mode (useful when email not configured)
    console.log(`\n🔐 OTP for ${trimmed}: ${otp}  [emailSent=${emailSent}]\n`);

    return NextResponse.json({
      message: emailSent
        ? `OTP sent to ${trimmed}. Check your inbox.`
        : `OTP generated. Check the server console (dev mode).`,
      // Expose OTP in dev mode response so it can be seen in browser devtools too
      ...(process.env.NODE_ENV === 'development' && { devOtp: otp }),
    }, { status: 200 });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[send-otp error]', msg);
    return NextResponse.json({
      error: `Failed to send OTP: ${msg}`,
    }, { status: 500 });
  }
}

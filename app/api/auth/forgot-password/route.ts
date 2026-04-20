import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import { sendEmail } from '../../../../lib/utils/sendEmail';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const trimmedEnvEmail = email.trim().toLowerCase();

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database connection failed. Please try later.' }, { status: 503 });
    }

    const user = await User.findOne({ email: new RegExp(`^${trimmedEnvEmail}$`, 'i') });

    if (!user) {
      // Don't leak that the user doesn't exist for security purposes
      return NextResponse.json({ message: 'If an account exists, a reset link will be sent to it.' }, { status: 200 });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = resetPasswordExpires;
    
    await user.save();

    // Construct the reset URL dynamically based on current origin if possible, otherwise fallback to localhost
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const resetUrl = `${origin}/auth/reset?token=${token}&email=${encodeURIComponent(user.email)}`;

    // Attempt to send email
    const emailSent = await sendEmail({
      to: user.email,
      subject: 'GLOWMART - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; background:#0a0a0a; color:#fff; padding:40px; text-align:center;">
          <h1 style="color:#2874f0; letter-spacing:0.2em; margin-bottom:4px;">GLOWMART</h1>
          <p style="font-size:12px; color:#aaa; margin-bottom:28px;">Password Recovery</p>
          <p style="font-size:16px; color:#ccc;">You recently requested to reset your password. Click the button below to update it:</p>
          
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2874f0; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; letter-spacing: 1px; display: inline-block;">
              RESET PASSWORD
            </a>
          </div>

          <p style="font-size:13px; color:#888; margin-top:16px;">This link will expire in <strong style="color:#fff">1 Hour</strong>.</p>
          <p style="font-size:11px; color:#444; margin-top:32px;">If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log(`\n🔐 Password Reset Link for ${user.email}: ${resetUrl}  [emailSent=${emailSent}]\n`);

    return NextResponse.json({
      message: 'If an account exists, a reset link will be sent to it.',
    }, { status: 200 });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[forgot-password error]', msg);
    return NextResponse.json({
      error: `Failed to process request: ${msg}`,
    }, { status: 500 });
  }
}

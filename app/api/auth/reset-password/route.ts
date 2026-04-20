import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database connection failed. Please try later.' }, { status: 503 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user with exact email, token matching, and expiry date > now
    const user = await User.findOne({
      email: new RegExp(`^${trimmedEmail}$`, 'i'),
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ error: 'Password reset link is invalid or has expired.' }, { status: 400 });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 10);
    user.passwordHash = newPasswordHash;

    // Clear reset tokens
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return NextResponse.json({
      message: 'Your password has been successfully reset. You can now login.',
    }, { status: 200 });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[reset-password error]', msg);
    return NextResponse.json({
      error: `Failed to reset password: ${msg}`,
    }, { status: 500 });
  }
}

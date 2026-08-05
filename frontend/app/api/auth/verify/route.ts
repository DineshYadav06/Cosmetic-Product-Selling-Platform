import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing email or OTP token' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 401 });
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 401 });
    }

    // Mark user as verified & clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Issue JWT so user is logged in immediately
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'OTP verified successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, { status: 200 });

  } catch (error) {
    console.error('[verify error]', error);
    return NextResponse.json({ error: 'Verification error' }, { status: 500 });
  }
}

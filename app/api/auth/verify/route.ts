import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';

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

    if (user.isVerified) {
      return NextResponse.json({ error: 'Account already verified' }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
       return NextResponse.json({ error: 'OTP has expired. Please register again to get a new one' }, { status: 401 });
    }

    // Verify User and clear OTP data
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({ message: 'Email completely verified successfully!' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Verification error' }, { status: 500 });
  }
}

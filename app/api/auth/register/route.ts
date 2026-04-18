import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../../../../lib/utils/sendEmail';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name, email, password, dob, phoneNumber, building, landmark, location } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing core fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const newUser = new User({
      name,
      email,
      passwordHash,
      dob,
      phoneNumber,
      building,
      landmark,
      location,
      role: 'user',
      isVerified: false,
      otp,
      otpExpires
    });

    await newUser.save();

    // Send OTP Email
    const emailSent = await sendEmail({
      to: email,
      subject: 'GLOWMART - Verify Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px; text-align: center;">
          <h1 style="color: #d4af37; letter-spacing: 0.2em;">GLOWMART</h1>
          <p style="font-size: 16px; color: #cccccc;">Welcome to the luxury fragrance club, ${name}.</p>
          <p style="margin-top: 20px;">Your One-Time Password (OTP) for account verification is:</p>
          <div style="font-size: 32px; font-weight: bold; background: #222; margin: 20px auto; display: inline-block; padding: 15px 30px; letter-spacing: 5px; color: #d4af37;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #888;">This code will expire in 5 minutes. Do not share it.</p>
        </div>
      `
    });

    console.log(`\n=========================================\n`);
    console.log(`🔐 NEW REGISTRATION OTP FOR ${email}: ${otp}`);
    console.log(`=========================================\n`);

    if (!emailSent) {
      console.warn("Email failed to send. Returning OTP in dev mode for testing.");
      return NextResponse.json({ 
        message: 'Registration successful but email failed to send.', 
        error: "Email delivery failed", 
        ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
      }, { status: 201 });
    }

    return NextResponse.json({ message: 'User registered successfully. Please verify OTP.' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

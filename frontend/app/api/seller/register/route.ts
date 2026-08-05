import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { 
      name, email, password, phone, storeName,
      businessType, gstNumber, panNumber, businessAddress,
      bankAccountHolder, bankAccountNumber, ifscCode, bankName
    } = await request.json();

    if (!name || !email || !password || !phone || !storeName) {
      return NextResponse.json({ error: 'Core fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = new User({
      name,
      email,
      passwordHash,
      phoneNumber: phone,
      role: 'seller',
      isVerified: false,
      otp,
      otpExpires,
      sellerDetails: {
        storeName,
        phone,
        plan: 'basic',
        isApproved: false,
        joinedAt: new Date(),
        earnings: 0,
        businessType,
        gstNumber,
        panNumber,
        businessAddress,
        bankDetails: {
          accountHolder: bankAccountHolder,
          accountNumber: bankAccountNumber,
          ifscCode,
          bankName
        }
      }
    });

    await newUser.save();

    console.log(`🔐 SELLER REGISTRATION OTP FOR ${email}: ${otp}`);

    return NextResponse.json({ 
      message: 'Seller registered successfully.',
      devOtp: otp // Included for testing convenience
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

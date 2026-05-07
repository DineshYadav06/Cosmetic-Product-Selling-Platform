import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const { 
      storeName, phone, businessType, gstNumber, panNumber, 
      businessAddress, bankAccountHolder, bankAccountNumber, 
      ifscCode, bankName 
    } = await request.json();

    if (!storeName || !phone || !panNumber || !businessAddress) {
      return NextResponse.json({ error: 'Missing required business details' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'seller') {
      return NextResponse.json({ error: 'User is already a seller' }, { status: 400 });
    }

    user.role = 'seller';
    user.sellerDetails = {
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
    };

    await user.save();

    return NextResponse.json({ 
      message: 'Account upgraded to Seller successfully.',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

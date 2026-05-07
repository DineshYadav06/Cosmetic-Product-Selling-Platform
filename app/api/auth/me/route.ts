import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    await connectToDatabase();
    const user = await User.findById(decoded.userId).select('-password -otp -otpExpires');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

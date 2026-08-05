import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { tier } = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    await connectToDatabase();
    
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year membership

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        glowPass: {
          isActive: true,
          expiresAt: expiresAt,
          tier: tier || 'gold'
        }
      },
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `Welcome to GlowPass ${tier.toUpperCase()}!`, 
      user: updatedUser 
    }, { status: 200 });

  } catch (error) {
    console.error("GlowPass Upgrade Error:", error);
    return NextResponse.json({ error: 'Failed to upgrade to GlowPass' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all users sorted by latest
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('-passwordHash') // Exclude sensitive data
      .lean();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error("Users fetch error", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { userId, role, isApproved } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (isApproved !== undefined) {
      updateData['sellerDetails.isApproved'] = isApproved;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-passwordHash');

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("User update error", error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

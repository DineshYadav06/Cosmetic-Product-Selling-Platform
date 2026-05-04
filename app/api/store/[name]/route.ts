import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../lib/models/User';
import Product from '../../../lib/models/Product';

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    await connectToDatabase();
    const storeName = decodeURIComponent(params.name);
    
    const seller = await User.findOne({ 'sellerDetails.storeName': storeName }).select('-passwordHash').lean();
    
    if (!seller) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }
    
    const products = await Product.find({ sellerId: seller._id }).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ seller, products });
  } catch (error) {
    console.error("Store fetch error", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

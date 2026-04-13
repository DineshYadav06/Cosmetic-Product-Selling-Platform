import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../lib/models/Product';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware to Check Admin Status
const checkAdmin = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
    return decoded.role === 'admin';
  } catch (e) {
    return false;
  }
};

export async function POST(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();
    const data = await request.json();

    // Required Fields Validation roughly mapping to our standard Fragrance Model
    if (!data.name || !data.brand || !data.price || !data.image) {
      return NextResponse.json({ error: 'Please provide all required product details' }, { status: 400 });
    }

    const newProduct = new Product(data);
    const savedProduct = await newProduct.save();

    return NextResponse.json({ message: 'Product created successfully', product: savedProduct }, { status: 201 });
  } catch (error) {
    console.error("Admin Product Creation Error:", error);
    return NextResponse.json({ error: 'Server error during product creation' }, { status: 500 });
  }
}

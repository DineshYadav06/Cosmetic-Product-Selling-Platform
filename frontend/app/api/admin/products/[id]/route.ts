import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });

    await connectToDatabase();
    const resolvedParams = await params;
    const body = await request.json();

    const updatedProduct = await (Product as any).findByIdAndUpdate(resolvedParams.id, body, { new: true });
    
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Admin Product Update Error:", error);
    return NextResponse.json({ error: 'Server error during product modification' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });

    await connectToDatabase();
    const resolvedParams = await params;

    const deletedProduct = await (Product as any).findByIdAndDelete(resolvedParams.id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product permanently removed from catalog' }, { status: 200 });
  } catch (error) {
    console.error("Admin Product Delete Error:", error);
    return NextResponse.json({ error: 'Server error during product deletion' }, { status: 500 });
  }
}

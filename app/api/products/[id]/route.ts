import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../lib/models/Product';
import mongoose from 'mongoose';
import { verifyAuth, hasRole } from '../../../../lib/utils/auth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Product ID format' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth();
    if (!user || !hasRole(user, ['admin', 'seller'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Product ID format' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check ownership: Only Admin or the Seller who created the product can edit
    if (user.role !== 'admin' && product.sellerId?.toString() !== user.userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this product' }, { status: 403 });
    }

    const body = await request.json();
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        brand: body.brand,
        name: body.name,
        price: Number(body.price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
        image: body.image,
        description: body.description,
        category: body.category,
        inStock: body.inStock !== undefined ? body.inStock : true,
        stockCount: body.stockCount !== undefined ? Number(body.stockCount) : 50,
        skinType: body.skinType || [],
        concerns: body.concerns || [],
        benefits: body.benefits || "",
      },
      { new: true }
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth();
    if (!user || !hasRole(user, ['admin', 'seller'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Product ID format' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Only Admin or the Seller who created the product can delete
    if (user.role !== 'admin' && product.sellerId?.toString() !== user.userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this product' }, { status: 403 });
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Product successfully deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../lib/models/Product';
import { verifyAuth, hasRole } from '../../../lib/utils/auth';
import { z } from 'zod';

const productSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().optional(),
  image: z.string().url("Valid image URL is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  inStock: z.boolean().optional(),
  stockCount: z.number().nonnegative().optional(),
  skinType: z.array(z.string()).optional(),
  concerns: z.array(z.string()).optional(),
  benefits: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const query = category ? { category } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAuth();
    if (!user || !hasRole(user, ['admin', 'seller'])) {
      return NextResponse.json({ error: 'Unauthorized: Sellers and Admins only' }, { status: 403 });
    }

    await connectToDatabase();
    const json = await request.json();
    const body = productSchema.parse(json);
    
    const newProduct = new Product({
      ...body,
      sellerId: user.userId // Link product to the authenticated seller
    });
    
    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Validation error' }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

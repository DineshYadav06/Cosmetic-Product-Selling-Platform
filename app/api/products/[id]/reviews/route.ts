import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import Product from '../../../../../lib/models/Product';
import { verifyAuth } from '../../../../../lib/utils/auth';
import { z } from 'zod';
import mongoose from 'mongoose';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Comment must be at least 3 characters"),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please login to review' }, { status: 401 });
    }

    await connectToDatabase();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
    }

    const json = await request.json();
    const { rating, comment } = reviewSchema.parse(json);

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Add review
    const newReview = {
      name: user.role === 'admin' ? 'Admin' : 'Verified Buyer', // Simple for now
      rating,
      comment,
      createdAt: new Date()
    };

    product.reviewItems = product.reviewItems || [];
    product.reviewItems.push(newReview);

    // Update aggregate rating
    const totalReviews = product.reviewItems.length;
    const avgRating = product.reviewItems.reduce((acc: number, item: any) => acc + item.rating, 0) / totalReviews;
    
    product.reviews = totalReviews;
    product.rating = Number(avgRating.toFixed(1));

    await product.save();

    return NextResponse.json({ message: 'Review added successfully', product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

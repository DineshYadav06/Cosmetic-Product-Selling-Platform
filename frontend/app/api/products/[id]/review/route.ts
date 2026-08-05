import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { name, rating, comment } = await request.json();
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    if (!name || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Add review
    const newReview = { name, rating: Number(rating), comment, createdAt: new Date() };
    if (!product.reviewItems) product.reviewItems = [];
    product.reviewItems.push(newReview);

    // Update aggregate rating and count
    const totalReviews = product.reviewItems.length;
    const avgRating = product.reviewItems.reduce((acc, item) => acc + item.rating, 0) / totalReviews;
    
    product.reviews = totalReviews;
    product.rating = avgRating;

    await product.save();

    return NextResponse.json(product);
  } catch (error) {
    console.error("Review post error", error);
    return NextResponse.json({ error: 'Failed to post review' }, { status: 500 });
  }
}

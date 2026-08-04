import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const order = await Order.findById(id).lean();
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error("Order fetch error", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

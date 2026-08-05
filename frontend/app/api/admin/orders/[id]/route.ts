import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import mongoose from 'mongoose';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Order ID format' }, { status: 400 });
    }

    const body = await request.json();
    
    // We only allow updating the delivered status from the admin interface
    if (body.isDelivered === undefined) {
       return NextResponse.json({ error: 'Missing isDelivered property' }, { status: 400 });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        isDelivered: body.isDelivered,
        deliveredAt: body.isDelivered ? new Date() : undefined
      },
      { new: true } // Return updated document
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Update order error", error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function GET() {
  try {
    await connectToDatabase();
    
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean();
      
    // Transform arrays for frontend
    const mappedOrders = orders.map((order: any) => ({
      _id: order._id.toString(),
      customer: order.shippingAddress?.firstName 
        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` 
        : (order.user?.name || 'Guest'),
      email: order.user?.email || 'N/A',
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
      createdAt: order.createdAt,
      productsCount: order.products?.length || 0,
      paymentMethod: order.paymentMethod,
      address: `${order.shippingAddress?.address}, ${order.shippingAddress?.city}`
    }));

    return NextResponse.json(mappedOrders);
  } catch (error) {
    console.error("Orders list error", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

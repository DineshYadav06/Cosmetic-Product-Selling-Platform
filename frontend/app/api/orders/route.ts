import { NextResponse } from 'next/server';
import { verifyAuth } from "@/lib/utils/auth";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";

export async function GET() {
  try {
    const authUser = await verifyAuth();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch orders for the logged-in user
    const orders = await Order.find({ user: authUser.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'products.product',
        model: Product,
        select: 'name brand image price'
      })
      .lean();

    // Map to a cleaner format for the frontend
    const mappedOrders = orders.map((order: any) => ({
      id: order._id.toString(),
      total: order.totalPrice,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,
      products: order.products.map((p: any) => ({
        id: p.product?._id?.toString(),
        name: p.product?.name || 'Product Not Found',
        brand: p.product?.brand || 'GlowMart',
        image: p.product?.image || '',
        price: p.price,
        quantity: p.quantity
      }))
    }));

    return NextResponse.json(mappedOrders);
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

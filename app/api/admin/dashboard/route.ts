import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../lib/models/Product';
import Order from '../../../../lib/models/Order';
import User from '../../../../lib/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const userCount = await User.countDocuments();
    
    // Calculate total revenue from paid orders
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();
    
    // Process backend orders to match frontend needs
    const mappedOrders = recentOrders.map((order: any) => ({
      id: order._id.toString(),
      customer: order.shippingAddress?.firstName 
        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` 
        : (order.user?.name || 'Guest'),
      product: order.products?.length > 1 ? `${order.products.length} Items` : '1 Item',
      amount: order.totalPrice,
      status: order.isDelivered ? 'delivered' : (order.isPaid ? 'processing' : 'pending')
    }));

    const recentProducts = await Product.find({}).sort({ createdAt: -1 }).limit(5).lean();
    
    return NextResponse.json({
      stats: {
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue: totalRevenue,
        activeCustomers: userCount
      },
      recentOrders: mappedOrders,
      recentProducts
    });
  } catch (error) {
    console.error("Dashboard error", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

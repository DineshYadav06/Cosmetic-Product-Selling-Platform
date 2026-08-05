import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import { verifyAuth, hasRole } from "@/lib/utils/auth";

export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user || !hasRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Unauthorized: Admin access only' }, { status: 403 });
    }

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
    
    // Get low stock products
    const lowStockProducts = await Product.find({ 
      stockCount: { $lt: 10 } 
    }).sort({ stockCount: 1 }).limit(10).lean();

    // Monthly revenue for chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyStats = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const chartData = monthlyStats.map(stat => ({
      name: new Date(stat._id.year, stat._id.month - 1).toLocaleString('default', { month: 'short' }),
      revenue: stat.revenue
    }));
    
    return NextResponse.json({
      stats: {
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue: totalRevenue,
        activeCustomers: userCount
      },
      recentOrders: mappedOrders,
      recentProducts,
      lowStockProducts,
      chartData: chartData.length > 0 ? chartData : [
        { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 }, { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 }, { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 8000 }
      ]
    });
  } catch (error) {
    console.error("Dashboard error", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

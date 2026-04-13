import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectToDatabase from '../../../../lib/mongodb';
import Order from '../../../../lib/models/Order';
import jwt from 'jsonwebtoken';

// Note: JWT Verification logic is embedded here for Next Router compatibility
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_if_not_provided';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // 1. Verify Authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // 2. Parse Body Data
    const { orderItems, shippingAddress, totalPrice } = await request.json();

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ error: 'No order items' }, { status: 400 });
    }

    // 3. Initialize Razorpay Server Instance
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      throw new Error('Razorpay environmental variables missing.');
    }
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // 4. Create internal tracking Order in MongoDB (Status: Pending)
    const newOrder = new Order({
      user: decoded.userId,
      products: orderItems,
      shippingAddress,
      totalPrice,
      isPaid: false
    });
    const createdOrder = await newOrder.save();

    // 5. Fire Razorpay Order Request
    const options = {
      amount: Math.round(totalPrice * 100), // convert to paisa
      currency: "INR",
      receipt: createdOrder._id.toString(),
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return NextResponse.json({ 
      orderId: createdOrder._id, 
      razorpayOrder: razorpayOrder 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Razorpay Create Order Error:", error);
    return NextResponse.json({ error: 'Payment gateway integration failed' }, { status: 500 });
  }
}

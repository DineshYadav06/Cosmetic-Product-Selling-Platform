import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '../../../../lib/mongodb';
import Order from '../../../../lib/models/Order';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await request.json();

    const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

    if (!RAZORPAY_SECRET) {
      return NextResponse.json({ error: 'Razorpay secret config missing' }, { status: 500 });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await connectToDatabase();

      // Find tracking order and mark as successfully paid
      const order = await Order.findById(order_id);
      if (order) {
        if (order.isPaid) {
          return NextResponse.json({ message: 'Order already processed', order }, { status: 200 });
        }
        
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        };
        await order.save();

        // DECREMENT STOCK
        const Product = (await import('../../../../lib/models/Product')).default;
        for (const item of order.products) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stockCount: -item.quantity }
          });
          
          // Check if stock became zero and update inStock
          const updatedProduct = await Product.findById(item.product);
          if (updatedProduct && updatedProduct.stockCount <= 0) {
            updatedProduct.inStock = false;
            updatedProduct.stockCount = 0;
            await updatedProduct.save();
          }
        }
        
        return NextResponse.json({ message: 'Payment verified successfully and inventory updated!', order }, { status: 200 });
      } else {
        return NextResponse.json({ error: 'Tracking Order not found in DB' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid Digital Signature' }, { status: 400 });
    }
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 500 });
  }
}

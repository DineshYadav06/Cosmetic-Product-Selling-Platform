import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).lean();
    const users = await User.find({}).lean();
    return NextResponse.json({ 
      productsCount: products.length, 
      products,
      usersCount: users.length,
      users
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

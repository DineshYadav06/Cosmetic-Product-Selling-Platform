import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { verifyAuth, hasRole } from "@/lib/utils/auth";

export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user || !hasRole(user, ['admin', 'seller'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch products belonging to this seller
    const products = await Product.find({ sellerId: user.userId }).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Seller Products API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

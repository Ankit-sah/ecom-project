// app/api/orders/user/[userId]/route.ts

import { connectDB } from '@/app/lib/db';
import { Order } from '@/app/models/Order';
import { NextResponse } from 'next/server';


export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  await connectDB();
  
  try {
    const orders = await Order.find({ user: params?.userId })
      .populate('user', 'name email')
      .populate('items.product', 'name price image');
      
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
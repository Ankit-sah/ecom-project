// app/api/orders/route.ts

import { connectDB } from '@/app/lib/db';
import { Order } from '@/app/models/Order';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await Order.find({ user: session.user.id })
      .populate('user', 'name email')
      .populate('items.product', 'name price image');

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders'}, { status: 500 });
  }
}

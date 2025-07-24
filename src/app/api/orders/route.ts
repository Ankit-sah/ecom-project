// app/api/orders/route.ts

import { connectDB } from '@/app/lib/db';
import { Order } from '@/app/models/Order';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';


export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { items, totalAmount } = await req.json();

    const order = new Order({
      user: session.user.id, // 🔐 Use Auth0 user ID from session
      items,
      totalAmount,
      status: 'pending',
    });

    await order.save();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import prisma from '@/app/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
   const orders = await prisma.order.findMany({
  where: {
    user: session.user.id
  },
  include: {
    items: {
      include: {
        product: {  // Now properly recognized as a relation
          select: {
            title: true,
            price: true,
            image: true
          }
        }
      }
    },
    userRef: {
      select: {
        name: true,
        email: true
      }
    }
  }
});
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
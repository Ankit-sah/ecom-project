import { NextResponse } from 'next/server';
import  prisma  from '@/app/lib/db';

export async function GET() {
  try {
    const trashedProducts = await prisma.product.findMany({
      where: {
        isDeleted: true
      },
      orderBy: {
        deletedAt: 'desc'
      }
    });

    return NextResponse.json(trashedProducts);
  } catch (error) {
    console.error('Failed to fetch trashed products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trashed products' },
      { status: 500 }
    );
  }
}
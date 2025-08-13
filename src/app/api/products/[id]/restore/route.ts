import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/app/lib/db';

type Params = { id: string };

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await  params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Find and restore only if product is currently deleted
    const restored = await prisma.product.update({
      where: {
        id,
        isDeleted: true
      },
      data: {
        isDeleted: false,
        deletedAt: null
      }
    });

    if (!restored) {
      return NextResponse.json(
        { error: 'Deleted product not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Product restored successfully',
      product: restored,
    });
  } catch (error) {
    console.error('PATCH Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
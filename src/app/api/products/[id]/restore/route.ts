
import { Product } from '@/app/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/app/lib/db';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  const restored = await Product.findOneAndUpdate(
    { _id: id, isDeleted: true },
    { isDeleted: false, deletedAt: null },
    { new: true }
  );

  if (!restored) {
    return NextResponse.json({ error: 'Deleted product not found' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'Product restored successfully',
    product: restored,
  });
}

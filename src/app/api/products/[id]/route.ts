
import { Product } from '@/app/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/app/lib/db';
type tParams = Promise<{ id: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: tParams }
) {
  await connectDB();
  
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: tParams }
) {
  await connectDB();
  const { id } = await params;
  const data = await req.json();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  // Only update if product is not soft-deleted
  const existing = await Product.findOne({ _id: id, isDeleted: false });

  if (!existing) {
    return NextResponse.json({ error: 'Product not found or has been deleted' }, { status: 404 });
  }

  const updated = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return NextResponse.json(updated);
}


export async function DELETE(
  _req: NextRequest,
  { params }: { params: tParams }
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  const deleted = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!deleted) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Product soft-deleted successfully' });
}


import { connectDB } from '@/app/lib/db';
import { Product } from '@/app/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  const trashedProducts = await Product.find({ isDeleted: true }).sort({ deletedAt: -1 });

  return NextResponse.json(trashedProducts);
}

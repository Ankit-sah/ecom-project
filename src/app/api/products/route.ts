
import { connectDB } from '@/app/lib/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
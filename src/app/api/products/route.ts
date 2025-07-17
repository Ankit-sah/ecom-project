
import { connectDB } from '@/app/lib/db';
import { Product } from '@/app/models/Product';
import { NextRequest, NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     await connectDB();
//    const products = await Product.find({ isDeleted: false });
//     return NextResponse.json(products);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
//   }
// }
export async function GET(req: NextRequest) {
  await connectDB();

  const searchParams = req.nextUrl.searchParams;

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const skip = (page - 1) * limit;

  const filter: any = { isDeleted: false };

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  if (category) {
    filter.category = category;
  }

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  return NextResponse.json({
    page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    items: products,
  });
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
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const skip = (page - 1) * limit;

    // Build the where clause with proper typing
    const where: Prisma.ProductWhereInput = { 
      isDeleted: false 
    };

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive' // Case-insensitive search
      };
    }

    if (category) {
      where.category = category;
    }

    // Execute paginated query
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.product.count({ where })
    ]);
    
    return NextResponse.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items
    });

  } catch (err) {
    console.error('Failed to fetch products:', err);
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    );
  }
}




export async function POST(req: NextRequest) {
  try {
    // Ensure Prisma is initialized
   
    const body = await req.json()
    
    // Validate required fields
    if (!body.title || typeof body.price !== 'number') {
      return NextResponse.json(
        { error: 'Invalid product data' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description || '',
        price: body.price,
        category: body.category || 'uncategorized',
        image: body.image || '',
        inStock: body.inStock !== undefined ? body.inStock : true,
        isDeleted: false
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { connectDB } from '@/app/lib/db';
import { NextResponse } from 'next/server';



export async function GET() {
  try {
   
    await connectDB();
    return NextResponse.json({ message: 'MongoDB Connected ✅' });
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    return NextResponse.json({ error: 'MongoDB Connection Failed ❌' }, { status: 500 });
  }
}



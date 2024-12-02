import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Limit from '@/models/Limits';

export async function GET() {
  await connectMongoDB();
  const limits = await Limit.find();
  return NextResponse.json(limits);
}

export async function PUT(req: NextRequest) {
  try {
    await connectMongoDB();
    const body = await req.json();

    // Find first limit document or create new one if none exists
    const limit = await Limit.findOneAndUpdate(
      {}, // empty filter to match first doc
      body,
      {
        new: true, // return updated document
        upsert: true // create if doesn't exist
      }
    );

    return NextResponse.json(limit);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update limit' },
      { status: 500 }
    );
  }
}

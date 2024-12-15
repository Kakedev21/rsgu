import { NextResponse } from 'next/server';
import SizeController from '@/controller/Size';

export async function GET() {
  try {
    const sizes = await SizeController.getAllSizes();
    return NextResponse.json(sizes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sizes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const size = await SizeController.create(data);
    return NextResponse.json(size);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create size' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const size = await SizeController.update(id, data);
    return NextResponse.json(size);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update size' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const size = await SizeController.delete(id);
    return NextResponse.json(size);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete size' },
      { status: 500 }
    );
  }
}

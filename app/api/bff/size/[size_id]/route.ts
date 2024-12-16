import { NextResponse } from 'next/server';
import SizeController from '@/controller/Size';

export async function GET(
  request: Request,
  { params }: { params: { size_id: string } }
) {
  try {
    const size = await SizeController.getSizeById(params.size_id);
    if (!size) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }
    return NextResponse.json(size);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch size' },
      { status: 500 }
    );
  }
}

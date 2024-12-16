import { NextRequest, NextResponse } from 'next/server';
import OrderController from '@/controller/Order';

export const dynamic = 'force-dynamic'; // Add this line
export const revalidate = 0; // Add this line

export async function GET(req: NextRequest) {
  try {
    const orders = await OrderController.getCompletedOrders();
    const response = NextResponse.json({ orders });

    // Add these headers
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');

    return response;
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

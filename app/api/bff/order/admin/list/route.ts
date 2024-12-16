import { NextRequest, NextResponse } from 'next/server';
import OrderController from '@/controller/Order';

export async function GET(req: NextRequest) {
  try {
    // Add cache control headers to prevent caching
    const response = NextResponse.json({
      orders: await OrderController.getCompletedOrders()
    });

    // Set headers to prevent caching
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, max-age=0'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

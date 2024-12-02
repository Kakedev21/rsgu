import { NextRequest, NextResponse } from 'next/server';
import OrderController from '@/controller/Order';

export async function GET(req: NextRequest) {
  try {
    const orders = await OrderController.getCompletedOrders();
    return NextResponse.json({ orders });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

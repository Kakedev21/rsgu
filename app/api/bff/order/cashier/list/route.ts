import { NextRequest, NextResponse } from 'next/server';
import RequestHeaderValidator from '@/lib/requestHeaderValidator';
import { OrderProps } from '@/types/Order';
import OrderController from '@/controller/Order';

export async function GET(req: NextRequest) {
  try {
    const orders = await OrderController.getPendingOrders();
    return NextResponse.json({ orders });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

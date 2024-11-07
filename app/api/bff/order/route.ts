import OrderController from '@/controller/Order';

import RequestHeaderValidator from '@/lib/requestHeaderValidator';
import { OrderProps } from '@/types/Order';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderProps[];
    if (!RequestHeaderValidator.authenticate(req)) {
      return NextResponse.json({ status: 401 });
    }

    const order = await OrderController.create(body);
    return NextResponse.json({ order });
  } catch (e) {
    console.log('e', e);
    return NextResponse.json({
      error: e
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!RequestHeaderValidator.authenticate(req)) {
      return NextResponse.json({ status: 401 });
    }
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get('page'));
    const limit = Number(searchParams.get('limit'));
    const search = searchParams.get('q') as string;
    const status = searchParams.get('status') as string;
    const orders = await OrderController.orders(req, {
      page,
      limit,
      q: search,
      status
    });
    return NextResponse.json({
      orders
    });
  } catch (e) {
    return NextResponse.json({
      error: e
    });
  }
}

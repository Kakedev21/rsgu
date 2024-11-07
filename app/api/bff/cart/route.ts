import CartController from '@/controller/Cart';

import RequestHeaderValidator from '@/lib/requestHeaderValidator';
import { CartProps } from '@/types/Cart';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CartProps[];
    if (!RequestHeaderValidator.authenticate(req)) {
      return NextResponse.json({ status: 401 });
    }

    const cart = await CartController.create(body);
    return NextResponse.json({ cart });
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

    const cart = await CartController.cart(req, { page, limit, q: search });
    return NextResponse.json({
      cart
    });
  } catch (e) {
    return NextResponse.json({
      error: e
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!RequestHeaderValidator.authenticate(req)) {
      return NextResponse.json({ status: 401 });
    }
    const body = (await req.json()) as {
      cart_id: string;
      action: 'add' | 'remove';
    };
    const cart_id = body.cart_id;
    const action = body.action;

    const cart = await CartController.updateCartQuantity(cart_id, action);

    if (!cart) {
      return NextResponse.json(
        {
          error: 'Cart not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ cart });
  } catch (e) {
    return NextResponse.json({
      error: e
    });
  }
}

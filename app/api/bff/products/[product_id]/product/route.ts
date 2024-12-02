import { NextRequest, NextResponse } from 'next/server';
import RequestHeaderValidator from '@/lib/requestHeaderValidator';
import ProductController from '@/controller/Product';

export async function GET(
  req: NextRequest,
  { params }: { params: { product_id: string } }
) {
  try {
    if (!RequestHeaderValidator.authenticate(req)) {
      return NextResponse.json({ status: 401 });
    }
    const product = await ProductController.getById(params.product_id);
    return NextResponse.json({
      product
    });
  } catch (e) {
    console.log('e', e);
    return NextResponse.json({
      error: e
    });
  }
}

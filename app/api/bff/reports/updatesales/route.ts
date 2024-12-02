import { NextRequest, NextResponse } from 'next/server';
import RequestHeaderValidator from '@/lib/requestHeaderValidator';
import ReportController from '@/controller/Report';

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { productId, salesQuantity, date } = body;
  console.log('body', body);
  const report = await ReportController.updateDailyReport(
    productId,
    salesQuantity,
    date
  );
  return NextResponse.json({
    report
  });
}

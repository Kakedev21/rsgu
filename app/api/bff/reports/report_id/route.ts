import { NextRequest, NextResponse } from 'next/server';
import RequestHeaderValidator from '@/lib/requestHeaderValidator';
import ReportController from '@/controller/Report';

export async function PUT(req: NextRequest) {
  try {
    if (!RequestHeaderValidator.authenticate(req)) {
      return NextResponse.json({ status: 401 });
    }
    const report = await ReportController.updateReport(req);
    return NextResponse.json({
      report
    });
  } catch (e) {
    console.log('e', e);
    return NextResponse.json({
      error: e
    });
  }
}

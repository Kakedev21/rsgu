import { NextRequest, NextResponse } from 'next/server';
import RequestHeaderValidator from '@/lib/requestHeaderValidator';
import ReportController from '@/controller/Report';

export async function GET(req: NextRequest) {
  try {
    if (!RequestHeaderValidator.authenticate(req)) {
      return NextResponse.json({ status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');
    const date = searchParams.get('date');

    let report;
    if (type === 'day') {
      report = await ReportController.getReportByDay(
        date ? new Date(date) : new Date()
      );
    }
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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const report = await ReportController.updateReport(body);
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

export async function POST(req: NextRequest) {
  try {
    if (!RequestHeaderValidator.authenticate(req)) {
      return NextResponse.json({ status: 401 });
    }
    const body = await req.json();
    console.log('body', body);
    const report = await ReportController.createReport(body);
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

export async function DELETE(req: NextRequest) {
  try {
    if (!RequestHeaderValidator.authenticate(req)) {
      return NextResponse.json({ status: 401 });
    }
    const report = await ReportController.deleteReport(req);
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

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

    let report;
    if (type === 'day') {
      report = await ReportController.getReportByDay(req);
    } else if (type === 'month') {
      report = await ReportController.getReportByMonth(req);
    } else {
      report = await ReportController.getReport(req);
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

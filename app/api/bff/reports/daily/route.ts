import { NextRequest, NextResponse } from 'next/server';
import ReportController from '@/controller/Report';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const date = searchParams.get('date');
  if (!date) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    );
  }
  const report = await ReportController.getReportBySpecificDay(new Date(date));
  return NextResponse.json({
    report
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const date = body.date;
  if (!date) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    );
  }
  const report = await ReportController.updateDailyReport(date, body);
  return NextResponse.json({
    report
  });
}

export async function POST(req: NextRequest) {
  const report = await ReportController.createDailyReport();
  return NextResponse.json({
    report
  });
}

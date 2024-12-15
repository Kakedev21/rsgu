import { NextRequest, NextResponse } from 'next/server';
import ReportController from '@/controller/Report';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const reports = await ReportController.getReportByDateRange(
      new Date(startDate),
      new Date(endDate)
    );

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Error fetching reports' },
      { status: 500 }
    );
  }
}

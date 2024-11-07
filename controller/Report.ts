import { connectMongoDB } from '@/lib/mongodb';
import { NextRequest } from 'next/server';
import Report from '@/models/Report';

const ReportController = {
  getReport: async (req: NextRequest) => {
    await connectMongoDB();
    const report = await Report.find();
    return report;
  },
  getReportByDay: async (req: NextRequest) => {
    await connectMongoDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const report = await Report.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('productId');

    return report;
  },
  getReportByMonth: async (req: NextRequest) => {
    await connectMongoDB();
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    const report = await Report.find({
      date: {
        $gte: firstDayOfMonth,
        $lte: lastDayOfMonth
      }
    }).populate('productId');

    return report;
  },
  createReport: async (data: any) => {
    await connectMongoDB();
    console.log('reqfrom', data);
    const report = await Report.create(data);
    return report;
  },

  updateReport: async (req: NextRequest) => {
    await connectMongoDB();
    const body = await req.json();
    const report = await Report.findByIdAndUpdate(body._id, body);
    return report;
  },
  deleteReport: async (req: NextRequest) => {
    await connectMongoDB();
    const body = await req.json();
    const report = await Report.findByIdAndDelete(body._id);
    return report;
  }
};

export default ReportController;

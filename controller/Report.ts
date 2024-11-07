import { connectMongoDB } from '@/lib/mongodb';
import Report from '@/models/Report';

const ReportController = {
  getReportByDay: async (date: Date) => {
    await connectMongoDB();

    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const report = await Report.find({
      date: {
        $gte: queryDate,
        $lt: nextDay
      }
    }).populate('productId');

    return report;
  },
  createReport: async (data: any) => {
    await connectMongoDB();
    const report = await Report.create(data);
    return report;
  },

  updateReport: async (data: any) => {
    await connectMongoDB();
    const report = await Report.findByIdAndUpdate(data._id, { $set: data });
    return report;
  },

  deleteReport: async (data: any) => {
    await connectMongoDB();
    const report = await Report.findByIdAndDelete(data._id);
    return report;
  }
};

export default ReportController;

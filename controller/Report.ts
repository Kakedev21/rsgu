import { connectMongoDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Report from '@/models/Report';

const ReportController = {
  //get all reports
  getAllReports: async () => {
    await connectMongoDB();
    const reports = await Report.find();
    return reports;
  },

  createDailyReport: async () => {
    await connectMongoDB();
    try {
      const products = await Product.find({});

      const reports = await Promise.all(
        products.map(async (product) => {
          const lastReport = await Report.findOne({
            productId: product._id
          }).sort({ createdAt: -1 });

          const beginningInventory = lastReport
            ? lastReport.endingInventory
            : {
                quantity: product.quantity,
                unitCost: product.cost,
                unitPrice: product.price
              };

          // Removed received property from report creation
          return await Report.create({
            productId: product._id,
            beginningInventory,
            sales: {
              quantity: 0,
              unitCost: product.cost,
              unitPrice: product.price
            },
            endingInventory: {
              quantity: beginningInventory.quantity,
              unitCost: product.cost,
              unitPrice: product.price
            }
          });
        })
      );

      return reports;
    } catch (error) {
      console.error('Error generating daily reports:', error);
      throw error;
    }
  },

  updateDailyReport: async (
    productId: string,
    salesQuantity: number,
    date: Date = new Date()
  ) => {
    await connectMongoDB();
    try {
      // Convert date string to Date object if needed and adjust for local timezone
      const searchDate = new Date(date);
      searchDate.setMinutes(
        searchDate.getMinutes() - searchDate.getTimezoneOffset()
      );

      // Create start and end of day dates in local timezone
      const startOfDay = new Date(searchDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(searchDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Find today's report for the product
      const report = await Report.findOne({
        productId,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });

      if (!report) {
        return {
          status: 'error',
          message: 'No report found for today'
        };
      }

      // Update sales and ending inventory
      report.sales.quantity += salesQuantity;
      report.endingInventory.quantity =
        report.beginningInventory.quantity - report.sales.quantity;

      await report.save();
      console.log('report', report);
      return {
        status: 'success',
        report
      };
    } catch (error) {
      console.error('Error updating report sales:', error);
      return {
        status: 'error',
        message: 'Error updating report sales'
      };
    }
  },

  getReportBySpecificDay: async (date: Date) => {
    await connectMongoDB();

    // Create date at midnight in local timezone
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Convert to UTC for MongoDB query
    const utcStartDate = new Date(startDate.toISOString());
    const utcEndDate = new Date(endDate.toISOString());

    console.log('Querying between:', utcStartDate, 'and', utcEndDate); // Debug log

    const report = await Report.find({
      createdAt: {
        $gte: utcStartDate,
        $lte: utcEndDate
      }
    }).populate('productId');

    console.log('Found reports:', report.length); // Debug log
    return report;
  },

  getReportByDay: async (date: Date) => {
    await connectMongoDB();

    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const report = await Report.find({
      createdAt: {
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

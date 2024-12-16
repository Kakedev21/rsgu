const mongoose = require('mongoose');

import { NextRequest } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { OrderProps } from '@/types/Order';
import Product from '@/models/Product';

const OrderController = {
  orders: async (
    req: NextRequest,
    {
      page,
      limit,
      q,
      status
    }: { page: number; limit: number; q?: string; status?: string }
  ) => {
    await connectMongoDB();

    const filter = {
      ...(q
        ? {
            idString: { $regex: q, $options: 'i' }
          }
        : {}),
      ...(status
        ? {
            status
          }
        : {})
    };

    const [orders, count] = await Promise.all([
      await Order.aggregate([
        {
          $addFields: {
            idString: { $toString: '$_id' } // Convert ObjectId to string
          }
        },
        {
          $match: {
            ...filter // Apply any additional filters here
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users', // Name of the users collection
            let: {
              ...(status === 'Paid' ? { cashierId: '$cashier' } : {}),
              ...(status === 'Completed' ? { adminId: '$admin' } : {})
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      ...(status === 'Paid'
                        ? [{ $eq: ['$_id', '$$cashierId'] }]
                        : []),
                      ...(status === 'Completed'
                        ? [{ $eq: ['$_id', '$$adminId'] }]
                        : [])

                      // Match admin
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  email: 1,
                  role: 1 // Adjust based on your user schema
                }
              }
            ],
            as: 'userDetails' // Output array field for user details
          }
        },
        {
          // Unwind userDetails to separate documents
          $unwind: {
            path: '$userDetails',
            preserveNullAndEmptyArrays: true // Keeps orders without user details
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'products'
          }
        },
        {
          $skip: (page - 1) * limit // Pagination
        },
        {
          $limit: limit // Pagination limit
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            totalAmount: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            products: 1,
            productAndQty: 1,
            user: {
              _id: '$user._id',
              name: '$user.name',
              email: '$user.email',
              contactNumber: '$user.contactNumber'
            },
            cashier: {
              _id: {
                $cond: [
                  { $eq: ['$userDetails._id', '$cashier'] },
                  '$userDetails._id',
                  null
                ]
              },
              name: {
                $cond: [
                  { $eq: ['$userDetails._id', '$cashier'] },
                  '$userDetails.name',
                  null
                ]
              },
              email: {
                $cond: [
                  { $eq: ['$userDetails._id', '$cashier'] },
                  '$userDetails.email',
                  null
                ]
              }
            },
            admin: {
              _id: {
                $cond: [
                  { $eq: ['$userDetails._id', '$admin'] },
                  '$userDetails._id',
                  null
                ]
              },
              name: {
                $cond: [
                  { $eq: ['$userDetails._id', '$admin'] },
                  '$userDetails.name',
                  null
                ]
              },
              email: {
                $cond: [
                  { $eq: ['$userDetails._id', '$admin'] },
                  '$userDetails.email',
                  null
                ]
              }
            }
          }
        }
      ]),
      await Order.countDocuments({ ...filter }).exec()
    ]);
    return {
      orders,
      page,
      limit,
      count
    };
  },

  create: async (data: OrderProps[]) => {
    await connectMongoDB();
    const order = (await Order.insertMany(data)) as OrderProps[];
    return order;
  },
  getPendingOrders: async () => {
    await connectMongoDB();
    const orders = await Order.find({ status: 'Pending' }).exec();
    return orders;
  },

  getCompletedOrders: async () => {
    await connectMongoDB();
    const orders = await Order.find({ status: 'Completed' })
      .sort({ updatedAt: -1 }) // Add sorting to get the most recent data
      .lean() // For better performance
      .exec();
    return orders;
  },
  get: async (order_id: string) => {
    await connectMongoDB();
    const order = await Order.findOne({ _id: order_id }).exec();
    return order;
  },
  update: async (order_id: string, data: OrderProps) => {
    await connectMongoDB();
    const order = await Order.findOneAndUpdate(
      { _id: order_id },
      { ...data },
      { new: true, upsert: true, runValidators: true }
    );
    return order;
  },
  updateStatus: async (order_id: string, data: OrderProps) => {
    await connectMongoDB();
    const decrementProductQtys = async (productAndQty: any[]) => {
      try {
        // Create bulk operations for decrementing quantity based on productAndQty
        const bulkOps = productAndQty.map((item) => ({
          updateOne: {
            filter: { _id: item.productId },
            // Only decrement by the exact quantity amount
            update: { $inc: { quantity: -(item.quantity || 1) } }
          }
        }));

        // Execute the bulk operations
        const result = await Product.bulkWrite(bulkOps);

        // Get updated products
        const updatedProducts = await Product.find({
          _id: { $in: productAndQty.map((item) => item.productId) }
        });

        console.log('Quantities updated successfully:', result);
        return updatedProducts;
      } catch (error) {
        console.error('Error updating product quantities:', error);
        return;
      }
    };
    const order = await Order.findOneAndUpdate(
      { _id: order_id },
      { ...data },
      { new: true, upsert: true, runValidators: true }
    );
    // Only decrement quantities if admin is updating
    let updatedProducts;
    if (data.status === 'Completed') {
      updatedProducts = await decrementProductQtys(order?.['productAndQty']);
    }
    return {
      order,
      updatedProducts
    };
  },
  delete: async (order_id: string) => {
    await connectMongoDB();
    const order = await Order.deleteOne({ _id: order_id });
    return order;
  },
  userOrders: async ({
    user_id,
    q,
    page,
    limit
  }: {
    user_id: string;
    q?: string;
    page: number;
    limit: number;
  }) => {
    await connectMongoDB();

    const filter = {
      ...(q || user_id
        ? {
            $or: [
              {
                userId: new mongoose.Types.ObjectId(user_id)
              },
              ...(q
                ? [
                    {
                      idString: { $regex: q, $options: 'i' }
                    }
                  ]
                : [])
            ]
          }
        : {})
    };
    console.log(filter, user_id, new mongoose.Types.ObjectId(user_id));
    const [orders, count] = await Promise.all([
      await Order.aggregate([
        {
          $addFields: {
            idString: { $toString: '$_id' } // Convert ObjectId to string
          }
        },
        {
          $match: {
            ...filter
          }
        },
        {
          $lookup: {
            from: 'products', // Name of the products collection
            localField: 'productId', // Field in the orders collection (array)
            foreignField: '_id', // Field in the products collection
            as: 'products' // Name of the new array field to add
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            totalAmount: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            products: {
              $map: {
                input: '$products',
                as: 'product',
                in: {
                  _id: '$$product._id',
                  name: '$$product.name',
                  price: '$$product.price',
                  description: '$$product.description',
                  image: '$$product.image',
                  quantity: '$$product.quantity',
                  limit: '$$product.limit'
                }
              }
            }
          }
        },
        {
          $skip: (page - 1) * limit // Calculate the number of documents to skip
        },
        {
          $limit: limit // Limit the number of documents returned
        }
      ]),
      await Order.countDocuments({ ...filter }).exec()
    ]);
    return {
      orders,
      page,
      limit,
      count
    };
  },
  orderStatus: async ({ status }: { status: string }) => {
    await connectMongoDB();
    const count = await Order.countDocuments({ status: status });
    return count;
  },
  getTotalCountPerMonth: async (status: string) => {
    try {
      const results = await Order.aggregate([
        {
          $match: {
            status: status // Filter orders by status
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m', date: '$createdAt' } // Group by year and month
            },
            totalCount: { $sum: 1 } // Count each order
          }
        },
        {
          $sort: { _id: 1 } // Sort by month (ascending)
        }
      ]);

      // Create an array for all months in the year
      const monthlyCounts = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(0, i).toLocaleString('default', {
          month: 'long'
        });
        return { [`${month} ${new Date().getFullYear()}`]: 0 }; // Initialize with 0
      });

      // Populate the monthlyCounts with actual counts from results
      results.forEach((result) => {
        const dateParts = result._id.split('-');
        const monthIndex = parseInt(dateParts[1], 10) - 1; // Get month index (0-11)
        const year = dateParts[0];
        monthlyCounts[monthIndex] = {
          [`${new Date(year, monthIndex).toLocaleString('default', { month: 'long' })} ${year}`]:
            result.totalCount
        };
      });

      console.log('Total Count of Orders Per Month:', monthlyCounts);
      return monthlyCounts;
    } catch (error) {
      console.error('Error getting total count per month:', error);
    }
  },
  getTotalCountPerDayForMonth: async (month: number, year: number) => {
    try {
      const startDate = new Date(year, month - 1, 1); // Start of the month
      const endDate = new Date(year, month, 1); // Start of the next month

      const results = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lt: endDate
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } // Group by day
            },
            totalCount: { $sum: 1 } // Count each order
          }
        },
        {
          $sort: { _id: 1 } // Sort by day (ascending)
        }
      ]);

      // Create an array for all days of the month
      const totalCounts = Array.from(
        { length: new Date(year, month, 0).getDate() },
        (_, i) => {
          const day = i + 1;
          const dateString = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
          const foundDay = results.find((result) => result._id === dateString);
          return {
            date: dateString,
            totalCount: foundDay ? foundDay.totalCount : 0
          };
        }
      );

      console.log(
        `Total Count of Orders for ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}:`,
        totalCounts
      );
      return totalCounts;
    } catch (error) {
      console.error('Error getting total count for month:', error);
    }
  },

  cashier: {
    getOrder: async (order_id: string) => {
      await connectMongoDB();
      const order = await Order.aggregate([
        {
          $addFields: {
            idString: { $toString: '$_id' } // Convert ObjectId to string
          }
        },
        {
          $match: {
            idString: { $regex: order_id, $options: 'i' } // Use regex to match the substring
          }
        },
        {
          $lookup: {
            from: 'products', // Name of the products collection
            localField: 'productId', // Field in the orders collection (array)
            foreignField: '_id', // Field in the products collection
            as: 'products' // Name of the new array field to add
          }
        },
        {
          // Optional: Unwind if you want each product to have a separate document
          $unwind: {
            path: '$products',
            preserveNullAndEmptyArrays: true // Keeps orders without products
          }
        },
        {
          $lookup: {
            from: 'users', // Name of the users collection
            localField: 'userId', // Field in the orders collection
            foreignField: '_id', // Field in the users collection
            as: 'user' // Name of the new field to add for user details
          }
        },
        {
          // Optional: Unwind if you want each user to have a separate document
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true // Keeps orders without user details
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            totalAmount: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            productAndQty: 1,
            products: {
              _id: '$products._id',
              name: '$products.name',
              price: '$products.price',
              description: '$products.description',
              image: '$products.image',
              quantity: '$products.quantity',
              limit: '$products.limit'
            },
            user: {
              _id: '$user._id',
              name: '$user.name', // Adjust based on your user schema
              email: '$user.email' // Adjust based on your user schema
              // Add any other user fields you want to include
            }
          }
        }
      ]);

      return order as unknown as OrderProps;
    },
    transactions: async (cashier_id: string) => {
      await connectMongoDB();
      const results = await Order.aggregate([
        {
          $match: {
            cashier: cashier_id // Match orders by cashier ID
          }
        },
        {
          $lookup: {
            from: 'products', // Name of the products collection
            localField: 'productId', // Field in the orders collection
            foreignField: '_id', // Field in the products collection
            as: 'products' // Output array field
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }, // Group by updatedAt date
            orders: { $push: '$$ROOT' }, // Collect all orders in an array
            totalAmount: { $sum: '$totalAmount' }, // Optional: Sum of total amounts
            count: { $sum: 1 } // Optional: Count of orders per date
          }
        },
        {
          $sort: { _id: -1 } // Sort by date descending
        }
      ]);

      return results;
    }
  }
};

export default OrderController;


import { NextRequest } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { OrderProps } from '@/types/Order';
const OrderController = {
    orders: async (req: NextRequest, {page, limit, q, status}: {page: number, limit: number, q?: string, status?: string}) => {
        await connectMongoDB();
       
        const  filter = {
            ...(q ? {
                _id: q
            } : {}),
            ...(status ? {
              status
            }: {})
        };
    
        const [orders, count] = await Promise.all([
            await Order.find(
                {
                    ...filter
                }
            )
            .skip((page - 1) * limit)
            .limit(limit),
            await Order.countDocuments({...filter}).exec()
          ])
        return {
            orders,
            page,
            limit,
            count
        };
    },
    create: async (data: OrderProps[]) => {
        await connectMongoDB();
        const order = await Order.insertMany(data) as OrderProps[];
        return order;

    },
    get: async (order_id: string) => {
        await connectMongoDB();
        const order = await Order.findOne({_id: order_id}).exec()
        return order;
    },
    update: async (order_id: string, data: OrderProps) => {
        await connectMongoDB();
        const order = await Order.findOneAndUpdate({_id: order_id}, {...data}, { new: true, upsert: true, runValidators: true});
        return order;
    },
    delete: async (order_id: string) => {
        await connectMongoDB();
        const order = await Order.deleteOne(({_id: order_id}));
        return order;
    },
    userOrders: async ({user_id, q, page, limit}: {user_id: string,q?: string, page: number, limit: number}) => {
       
        await connectMongoDB();
        const regex = new RegExp(q as string, 'i');
        const  filter = {
            ...(q ? {
                $or: [
                    {
                        userId: user_id
                    },
                    {
                        _id: {$regex: regex}
                    }
                ]
            } : {})
        };
    
        const [orders, count] = await Promise.all([
            await Order.find(
                {
                    ...filter
                }
            )
            .populate('productId')
            .skip((page - 1) * limit)
            .limit(limit),
            await Order.countDocuments({...filter}).exec()
          ])
        return {
            orders,
            page,
            limit,
            count
        };
    },
    cashier: {
        getOrder: async (order_id: string) => {
            await connectMongoDB();
            const order =await Order.aggregate([
              {
                $addFields: {
                  idString: { $toString: "$_id" } // Convert ObjectId to string
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
                  products: {
                    _id: '$products._id',
                    name: '$products.name',
                    price: '$products.price',
                    description: '$products.description',
                    image: '$products.image'
                  },
                  user: {
                    _id: '$user._id',
                    name: '$user.name', // Adjust based on your user schema
                    email: '$user.email', // Adjust based on your user schema
                    // Add any other user fields you want to include
                  }
                }
              }
            ]);
            
            console.log(order);
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
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }, // Group by updatedAt date
                orders: { $push: "$$ROOT" }, // Collect all orders in an array
                totalAmount: { $sum: "$totalAmount" }, // Optional: Sum of total amounts
                count: { $sum: 1 } // Optional: Count of orders per date
              }
            },
            {
              $sort: { "_id": -1 } // Sort by date descending
            }
          ]);
           
          return results;
        }
    }
    
}

export default OrderController;
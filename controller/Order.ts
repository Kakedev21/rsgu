
import { NextRequest } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { OrderProps } from '@/types/Order';
const OrderController = {
    orders: async (req: NextRequest, {page, limit, q}: {page: number, limit: number, q?: string}) => {
        await connectMongoDB();
       
        const  filter = {
            ...(q ? {
                _id: q
            } : {})
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
    }
    
}

export default OrderController;
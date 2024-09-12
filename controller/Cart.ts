import { CartProps } from './../types/Cart';
import { NextRequest } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';

const CartController = {
    cart: async (req: NextRequest, {page, limit, q}: {page: number, limit: number, q?: string}) => {
        await connectMongoDB();
       
        const  filter = {
            ...(q ? {
                userId: q
            } : {})
        };
    
        const [carts, count] = await Promise.all([
            await Cart.find(
                {
                    ...filter
                }
            )
            .skip((page - 1) * limit)
            .limit(limit),
            await Cart.countDocuments({...filter}).exec()
          ])
        return {
            carts,
            page,
            limit,
            count
        };
    },
    create: async (data: CartProps[]) => {
        await connectMongoDB();
        const cart = await Cart.insertMany(data) as CartProps[];
        return cart;

    },
    get: async (cart_id: string) => {
        await connectMongoDB();
        const cart = await Cart.findOne({_id: cart_id}).exec()
        return cart;
    },
    update: async (cart_id: string, data: CartProps) => {
        await connectMongoDB();
        const cart = await Cart.findOneAndUpdate({_id: cart_id}, {...data}, { new: true, upsert: true, runValidators: true});
        return cart;
    },
    delete: async (cart_id: string) => {
        await connectMongoDB();
        const cart = await Cart.deleteOne(({_id: cart_id}));
        return cart;
    },
    clearCart: async (user_id: string) => {
        await connectMongoDB();
        const cart = await Cart.deleteMany(({userId: user_id}));
        return cart;
    },
    
}

export default CartController;
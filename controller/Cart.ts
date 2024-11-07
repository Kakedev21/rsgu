import { CartProps } from './../types/Cart';
import { NextRequest } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';

const CartController = {
  cart: async (
    req: NextRequest,
    { page, limit, q }: { page: number; limit: number; q?: string }
  ) => {
    await connectMongoDB();

    const filter = {
      ...(q
        ? {
            userId: q
          }
        : {})
    };

    const [carts, count] = await Promise.all([
      await Cart.find({
        ...filter
      })
        .skip((page - 1) * limit)
        .limit(limit),
      await Cart.countDocuments({ ...filter }).exec()
    ]);
    return {
      carts,
      page,
      limit,
      count
    };
  },
  create: async (data: CartProps[]) => {
    await connectMongoDB();

    const results = [];

    for (const item of data) {
      // Check if product already exists in cart for this user
      const existingCart = await Cart.findOne({
        productId: item.productId,
        userId: item.userId
      });

      if (existingCart) {
        // Update quantity of existing cart item
        const updatedCart = await Cart.findOneAndUpdate(
          { _id: existingCart._id },
          { $inc: { qty: item.qty || 1 } },
          { new: true }
        );
        results.push(updatedCart);
      } else {
        // Create new cart item
        const newCart = await Cart.create(item);
        results.push(newCart);
      }
    }

    return results;
  },
  get: async (cart_id: string) => {
    await connectMongoDB();
    const cart = await Cart.findOne({ _id: cart_id }).exec();
    return cart;
  },
  update: async (cart_id: string, data: CartProps) => {
    await connectMongoDB();
    const cart = await Cart.findOneAndUpdate(
      { _id: cart_id },
      { ...data },
      { new: true, upsert: true, runValidators: true }
    );
    return cart;
  },
  delete: async (cart_id: string) => {
    await connectMongoDB();
    const cart = await Cart.deleteOne({ _id: cart_id });
    return cart;
  },
  clearCart: async (user_id: string) => {
    await connectMongoDB();
    const cart = await Cart.deleteMany({ userId: user_id });
    return cart;
  },

  updateCartQuantity: async (cart_id: string, action: 'add' | 'remove') => {
    await connectMongoDB();
    const cart = await Cart.findOne({ _id: cart_id });

    if (!cart) {
      return null;
    }

    const currentQty = cart.qty || 1;
    const newQty =
      action === 'add' ? currentQty + 1 : Math.max(1, currentQty - 1);

    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cart_id },
      { qty: newQty },
      { new: true, runValidators: true }
    );

    return updatedCart;
  }
};

export default CartController;

import { ProductProps } from '../types/Product';
import { NextRequest } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

const ProductController = {
  products: async (
    req: NextRequest,
    {
      page,
      limit,
      q,
      category
    }: { page: number; limit: number; q?: string; category?: string }
  ) => {
    await connectMongoDB();
    const regex = new RegExp(q as string, 'i');
    const filter = {
      ...(q
        ? {
            $or: [
              {
                productId: { $regex: regex }
              },
              {
                name: { $regex: regex }
              },
              {
                description: { $regex: regex }
              }
            ]
          }
        : {}),
      ...(category
        ? {
            category: new mongoose.Types.ObjectId(category)
          }
        : {})
    };

    const [products, count] = await Promise.all([
      await Product.find({
        ...filter
      })
        .skip((page - 1) * limit)
        .limit(limit),
      await Product.countDocuments({ ...filter }).exec()
    ]);
    return {
      products,
      page,
      limit,
      count
    };
  },
  getById: async (product_id: string) => {
    await connectMongoDB();
    const product = await Product.findById(product_id).exec();
    return product;
  },
  create: async (data: ProductProps) => {
    await connectMongoDB();
    const product = (await Product.create(data)) as ProductProps;
    return product;
  },
  get: async (product_id: string) => {
    await connectMongoDB();
    const product = await Product.findOne({ _id: product_id }).exec();
    return product;
  },
  update: async (product_id: string, data: ProductProps) => {
    await connectMongoDB();
    console.log('data', data);
    const product = await Product.findOneAndUpdate(
      { _id: product_id },
      { ...data },
      { new: true, upsert: true, runValidators: true }
    );
    return product;
  },
  delete: async (product_id: string) => {
    await connectMongoDB();
    const product = await Product.deleteOne({ _id: product_id });
    return product;
  },
  getAllProductsWithQty: async () => {
    try {
      await connectMongoDB();
      const results = await Product.aggregate([
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            productId: 1,
            quantity: 1 // Include the fields you want
          }
        }
      ]);

      console.log('All Products with Quantity:', results);
      return results;
    } catch (error) {
      console.error('Error getting products with quantity:', error);
    }
  }
};

export default ProductController;

import { ProductProps } from '../types/Product';
import { NextRequest } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Product from '@/models/Product';

const ProductController = {
    products: async (req: NextRequest, {page, limit, q}: {page: number, limit: number, q?: string}) => {
        await connectMongoDB();
        const regex = new RegExp(q as string, 'i');
        const  filter = {
            ...(q ? {
                $or: [
                    {
                        productId: {$regex: regex}
                    },
                    {
                        name: {$regex: regex}
                    },
                    {
                        description: {$regex: regex}
                    },
                ]
            } : {})
        };
    
        const [products, count] = await Promise.all([
            await Product.find(
                {
                    ...filter
                }
            )
            .skip((page - 1) * limit)
            .limit(limit),
            await Product.countDocuments({...filter}).exec()
          ])
        return {
            products,
            page,
            limit,
            count
        };
    },
    create: async (data: ProductProps) => {
        await connectMongoDB();
        const product = await Product.create(data) as ProductProps;
        return product;

    },
    get: async (product_id: string) => {
        await connectMongoDB();
        const product = await Product.findOne({_id: product_id}).exec()
        return product;
    },
    update: async (product_id: string, data: ProductProps) => {
        await connectMongoDB();
        const product = await Product.findOneAndUpdate({_id: product_id}, {...data}, { new: true, upsert: true, runValidators: true});
        return product;
    },
    delete: async (product_id: string) => {
        await connectMongoDB();
        const product = await Product.deleteOne(({_id: product_id}));
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
    
}

export default ProductController;
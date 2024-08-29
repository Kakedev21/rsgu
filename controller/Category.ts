import { CategoryProps } from './../types/Product';
import { NextRequest } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Category from '@/models/Category';

const CategoryController = {
    categories: async (req: NextRequest, {page, limit, q}: {page: number, limit: number, q?: string}) => {
        await connectMongoDB();
        const regex = new RegExp(q as string, 'i');
        const  filter = {
            ...(q ? {
                $or: [
                    {
                        name: {$regex: regex}
                    },
                ]
            } : {})
        };
    
        const [categories, count] = await Promise.all([
            await Category.find(
                {
                    ...filter
                }
            )
            .skip((page - 1) * limit)
            .limit(limit),
            await Category.countDocuments().exec()
          ])
        return {
            categories,
            page,
            limit,
            count
        };
    },
    create: async (data: CategoryProps) => {
        await connectMongoDB();
        const category = await Category.create(data) as CategoryProps;
        return category;

    },
    get: async (category_id: string) => {
        await connectMongoDB();
        const category = await Category.findOne({_id: category_id}).exec()
        return category;
    },
    update: async (category_id: string, data: CategoryProps) => {
        await connectMongoDB();
        const category = await Category.findOneAndUpdate({_id: category_id}, {...data}, { new: true, upsert: true, runValidators: true});
        return category;
    },
    delete: async (category_id: string) => {
        await connectMongoDB();
        const category = await Category.deleteOne(({_id: category_id}));
        return category;
    },
    
}

export default CategoryController;
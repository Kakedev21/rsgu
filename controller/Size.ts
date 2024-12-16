import { NextRequest } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Size from '@/models/size';

export interface SizeProps {
  productId: string;
  size: string;
  yards: number;
}

const SizeController = {
  getAllSizes: async () => {
    await connectMongoDB();
    return await Size.find();
  },
  create: async (data: SizeProps[]) => {
    await connectMongoDB();
    return await Size.create(data);
  },
  update: async (id: string, data: SizeProps) => {
    await connectMongoDB();
    return await Size.findByIdAndUpdate(id, data);
  },
  delete: async (id: string) => {
    await connectMongoDB();
    return await Size.findByIdAndDelete(id);
  },
  getSizeById: async (id: string) => {
    await connectMongoDB();
    return await Size.findById(id);
  }
};

export default SizeController;

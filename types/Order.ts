import { ProductProps } from '@/types/Product';
import * as z from 'zod';
import { UserProps } from './User';

export const OrderFormSchema = z.object({
  productId: z.array(z.string().min(1)),
  status: z.string().min(1),
  userId: z.string().min(1),
  totalAmount: z.number()
});

export type OrderFormValues = z.infer<typeof OrderFormSchema>;

export interface OrderProps {
  _id?: string;
  productId: ProductProps[];
  productAndQty?: {
    productId: string;
    quantity: number;
  }[];
  status: string;
  totalAmount: number;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  products?: ProductProps;
  user?: UserProps;
  cashier?: UserProps;
  admin?: UserProps;
}

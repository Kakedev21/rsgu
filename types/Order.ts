import { ProductProps } from '@/types/Product';
import * as z from 'zod';

export  const OrderFormSchema = z.object({
    productId: z.array(z.string().min(1)),
    status: z.string().min(1),
    userId: z.string().min(1),
    totalAmount: z.number()
});

export type OrderFormValues = z.infer<typeof OrderFormSchema>

export interface OrderProps {
    _id?: string;
    productId: ProductProps[];
    status: string;
    totalAmount: number;
    userId: string;
    createdAt?: string;
    products?: ProductProps;
    
}

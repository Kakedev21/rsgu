import * as z from 'zod';

export  const CartFormSchema = z.object({
    productId: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number(),
    userId: z.string().min(1),
    qty: z.number()
});

export type CartFormValues = z.infer<typeof CartFormSchema>

export interface CartProps {
    _id?: string;
    productId: string;
    name: string;
    description: string;
    price: number;
    userId: string;
    qty: number
    createdAt?: string;
    
}

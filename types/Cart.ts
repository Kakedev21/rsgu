import * as z from 'zod';

export  const CartFormSchema = z.object({
    productId: z.string().min(1),
    userId: z.string().min(1),
    qty: z.number()
});

export type CartFormValues = z.infer<typeof CartFormSchema>

export interface CartProps {
    _id?: string;
    productId: string;
    userId: string;
    qty: number
    createdAt?: string;
    
}

import * as z from 'zod';

export interface CategoryProps {
  _id?: string;
  name: string;
  createdAt?: string;
  productsCount?: number;
}

export const categoryFormSchema = z.object({
  name: z.string().min(1)
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export interface ProductProps {
  _id?: string;
  category: string;
  productId?: string;
  name: string | undefined;
  description?: string | undefined;
  price: number;
  quantity?: number;
  cost?: number;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  status?: string;
  limit?: number;
  availableSizes?: { size: string; yards: number; price: number }[];
}

export const formSchema = z.object({
  category: z.string().min(1),
  productId: z.string().min(1),
  description: z.string(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().nonnegative(),
  cost: z.number().nonnegative(),
  limit: z.number().nonnegative(),
  availableSizes: z
    .array(z.object({ size: z.string(), yards: z.number(), price: z.number() }))
    .optional()
});

export type ProductFormValues = z.infer<typeof formSchema>;

import * as z from 'zod';

export interface ReportProps {
  _id?: string;
  productId: string;
  beginningInventory: {
    quantity: number;
    unitCost: number;
    totalCost: number;
  };
  received?: {
    quantity: number;
    unitCost: number;
    totalCost: number;
  };
  sales?: {
    quantity: number;
    unitCost: number;
    totalCost: number;
  };
  endingInventory?: {
    quantity: number;
    unitCost: number;
    totalCost: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export const reportFormSchema = z.object({
  productId: z.string().min(1, { message: 'Product ID is required' }),
  beginningInventory: z.object({
    quantity: z.number().min(0),
    unitCost: z.number().min(0),
    totalCost: z.number().min(0)
  }),
  received: z.object({
    quantity: z.number().min(0),
    unitCost: z.number().min(0),
    totalCost: z.number().min(0)
  }),
  sales: z.object({
    quantity: z.number().min(0),
    unitCost: z.number().min(0),
    totalCost: z.number().min(0)
  }),
  endingInventory: z.object({
    quantity: z.number().min(0),
    unitCost: z.number().min(0),
    totalCost: z.number().min(0)
  }),
  date: z.date().optional()
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;

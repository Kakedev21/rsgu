import * as z from 'zod';

export interface UserProps {
  _id?: string;
  id?: string;
  email: string | undefined;
  name: string | undefined;
  role?: string;
  profilePicture?: string;
  password?: string | undefined;
  username: string;
  department?: string | undefined;
  srCode?: string;
  contactNumber?: string;
  course?: string;
  subRole?: string;
}

export const formSchema = z.object({
  email: z.string().email().min(5),
  name: z.string().min(1),
  username: z.string().min(3),
  department: z.string(),
  role: z.string(),
  srCode: z.string().optional(),
  subRole: z.string().optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Password must contain at least one uppercase letter'
    })
    .refine((value) => /[a-z]/.test(value), {
      message: 'Password must contain at least one lowercase letter'
    })
    .refine((value) => /[0-9]/.test(value), {
      message: 'Password must contain at least one number'
    })
    .optional()
});

export type UserFormValues = z.infer<typeof formSchema>;

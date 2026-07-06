import { z } from 'zod';

const loginSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email('Invalid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    email: z.string({ message: 'Email is required' }).email('Invalid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    role: z.enum(['Admin', 'Manager', 'Employee'], {
      message: 'Role must be Admin, Manager, or Employee',
    }),
    isActive: z.boolean().optional(),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    role: z.enum(['Admin', 'Manager', 'Employee']).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const AuthValidation = {
  loginSchema,
  createUserSchema,
  updateUserSchema,
};

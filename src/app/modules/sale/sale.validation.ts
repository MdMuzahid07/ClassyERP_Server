import { z } from 'zod';

const createSaleSchema = z.object({
  body: z.object({
    customer: z
      .string({ message: 'Customer name is required' })
      .trim()
      .min(1, 'Customer name cannot be empty'),
    products: z
      .array(
        z.object({
          product: z
            .string({ message: 'Product ID is required' })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
          quantity: z
            .number({ message: 'Quantity is required' })
            .int('Quantity must be an integer')
            .min(1, 'Quantity must be at least 1'),
        }),
        { message: 'Products list is required' }
      )
      .min(1, 'A sale must contain at least one product'),
  }),
});

export const SaleValidation = {
  createSaleSchema,
};

import { z } from 'zod';

const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Product name is required' })
      .trim()
      .min(1, 'Product name cannot be empty'),
    sku: z.string({ message: 'SKU is required' }).trim().min(1, 'SKU cannot be empty'),
    category: z
      .string({ message: 'Category is required' })
      .trim()
      .min(1, 'Category cannot be empty'),
    purchasePrice: z
      .number({ message: 'Purchase price is required' })
      .min(0, 'Purchase price must be positive'),
    sellingPrice: z
      .number({ message: 'Selling price is required' })
      .min(0, 'Selling price must be positive'),
    stockQuantity: z
      .number({ message: 'Stock quantity is required' })
      .int('Stock quantity must be an integer')
      .min(0, 'Stock quantity cannot be negative'),
    productImage: z.string({ message: 'Product image is required' }).url('Invalid image URL'),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Product name cannot be empty').optional(),
    sku: z.string().trim().min(1, 'SKU cannot be empty').optional(),
    category: z.string().trim().min(1, 'Category cannot be empty').optional(),
    purchasePrice: z.number().min(0, 'Purchase price must be positive').optional(),
    sellingPrice: z.number().min(0, 'Selling price must be positive').optional(),
    stockQuantity: z
      .number()
      .int('Stock quantity must be an integer')
      .min(0, 'Stock quantity cannot be negative')
      .optional(),
    productImage: z.string().url('Invalid image URL').optional(),
  }),
});

export const ProductValidation = {
  createProductSchema,
  updateProductSchema,
};

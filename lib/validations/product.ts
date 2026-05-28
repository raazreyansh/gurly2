import { z } from 'zod'

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and dashes'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be greater than zero'),
  compareAtPrice: z.number().positive('Compare at price must be greater than zero').nullable().optional(),
  stock: z.number().int('Stock must be an integer').nonnegative('Stock cannot be negative'),
  featured: z.boolean().default(false),
  categoryId: z.string().uuid('Invalid category ID'),
  media: z.array(
    z.object({
      type: z.enum(['image', 'video', 'pdf', 'zip']),
      url: z.string().url('Invalid media URL'),
    })
  ).default([]),
})

export type ProductInput = z.infer<typeof productSchema>

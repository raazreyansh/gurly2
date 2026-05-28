import { z } from 'zod'
import { normalizeProductMedia } from '@/lib/product-media'

const mediaUrlSchema = z.string().min(1, 'Media URL is required').refine(
  (value) => value.startsWith('/') || /^https?:\/\//i.test(value),
  'Media URL must be an absolute URL or a site-relative path',
)

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(240, 'Title cannot exceed 240 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and dashes'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be greater than zero'),
  compareAtPrice: z.number().positive('Compare at price must be greater than zero').nullable().optional(),
  stock: z.number().int('Stock must be an integer').nonnegative('Stock cannot be negative'),
  featured: z.boolean().default(false),
  categoryId: z.string().uuid('Invalid category ID'),
  media: z.preprocess(
    normalizeProductMedia,
    z.array(
      z.object({
        type: z.enum(['image', 'video', 'pdf', 'zip']),
        url: mediaUrlSchema,
      })
    ).default([]),
  ),
})

export type ProductInput = z.infer<typeof productSchema>

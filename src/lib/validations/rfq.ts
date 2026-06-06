import { z } from 'zod'

export const rfqItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  specifications: z.string().optional(),
})

export const createRFQSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  department: z.string().min(1, 'Department is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  items: z.array(rfqItemSchema).min(1, 'At least one item is required'),
  estimatedBudget: z.number().positive().optional(),
  deadline: z.string().or(z.date()),
  deliveryLocation: z.string().optional(),
  paymentTerms: z.string().optional(),
  termsAndConditions: z.string().optional(),
  invitedVendors: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
})

export const updateRFQSchema = createRFQSchema.partial().extend({
  id: z.string(),
})

export const publishRFQSchema = z.object({
  id: z.string(),
  invitedVendors: z.array(z.string()).min(1, 'At least one vendor must be invited'),
})

export type RFQItem = z.infer<typeof rfqItemSchema>
export type CreateRFQInput = z.infer<typeof createRFQSchema>
export type UpdateRFQInput = z.infer<typeof updateRFQSchema>
export type PublishRFQInput = z.infer<typeof publishRFQSchema>

// Made with Bob

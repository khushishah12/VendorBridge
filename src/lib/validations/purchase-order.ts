import { z } from 'zod'

export const poItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  unitPrice: z.number().positive('Unit price must be positive'),
  totalPrice: z.number().positive('Total price must be positive'),
})

export const createPurchaseOrderSchema = z.object({
  quotationId: z.string().min(1, 'Quotation ID is required'),
  items: z.array(poItemSchema).min(1, 'At least one item is required'),
  totalAmount: z.number().positive('Total amount must be positive'),
  taxAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  finalAmount: z.number().positive('Final amount must be positive'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  deliveryDate: z.string().or(z.date()),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  paymentDueDate: z.string().or(z.date()).optional(),
  termsAndConditions: z.string().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
})

export const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial().extend({
  id: z.string(),
})

export const updatePOStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['SENT', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  cancellationReason: z.string().optional(),
})

export type POItem = z.infer<typeof poItemSchema>
export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>
export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>
export type UpdatePOStatusInput = z.infer<typeof updatePOStatusSchema>

// Made with Bob

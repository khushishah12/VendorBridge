import { z } from 'zod'

export const quotationItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  unitPrice: z.number().positive('Unit price must be positive'),
  totalPrice: z.number().positive('Total price must be positive'),
  specifications: z.string().optional(),
})

export const createQuotationSchema = z.object({
  rfqId: z.string().min(1, 'RFQ ID is required'),
  items: z.array(quotationItemSchema).min(1, 'At least one item is required'),
  totalAmount: z.number().positive('Total amount must be positive'),
  taxAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  finalAmount: z.number().positive('Final amount must be positive'),
  deliveryTime: z.number().positive('Delivery time must be positive'),
  validityPeriod: z.number().positive('Validity period must be positive'),
  paymentTerms: z.string().optional(),
  warranty: z.string().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
})

export const updateQuotationSchema = createQuotationSchema.partial().extend({
  id: z.string(),
})

export const reviewQuotationSchema = z.object({
  id: z.string(),
  status: z.enum(['SHORTLISTED', 'ACCEPTED', 'REJECTED']),
  remarks: z.string().optional(),
  rejectionReason: z.string().optional(),
})

export type QuotationItem = z.infer<typeof quotationItemSchema>
export type CreateQuotationInput = z.infer<typeof createQuotationSchema>
export type UpdateQuotationInput = z.infer<typeof updateQuotationSchema>
export type ReviewQuotationInput = z.infer<typeof reviewQuotationSchema>

// Made with Bob

import { z } from 'zod'

export const invoiceItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  unitPrice: z.number().positive('Unit price must be positive'),
  totalPrice: z.number().positive('Total price must be positive'),
})

export const createInvoiceSchema = z.object({
  purchaseOrderId: z.string().min(1, 'Purchase Order ID is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  subtotal: z.number().positive('Subtotal must be positive'),
  taxAmount: z.number().min(0),
  discountAmount: z.number().min(0).default(0),
  totalAmount: z.number().positive('Total amount must be positive'),
  invoiceDate: z.string().or(z.date()).optional(),
  dueDate: z.string().or(z.date()),
  notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
})

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  id: z.string(),
})

export const updateInvoiceStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['SENT', 'PAID', 'UNPAID', 'OVERDUE', 'CANCELLED']),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  paidDate: z.string().or(z.date()).optional(),
})

export type InvoiceItem = z.infer<typeof invoiceItemSchema>
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>
export type UpdateInvoiceStatusInput = z.infer<typeof updateInvoiceStatusSchema>

// Made with Bob

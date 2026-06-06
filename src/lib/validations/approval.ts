import { z } from 'zod'

export const createApprovalSchema = z.object({
  type: z.enum(['RFQ', 'Quotation', 'PurchaseOrder', 'Invoice']),
  referenceId: z.string().min(1, 'Reference ID is required'),
  quotationId: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  amount: z.number().positive('Amount must be positive'),
  department: z.string().min(1, 'Department is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  riskFlags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
  deadline: z.string().or(z.date()),
})

export const reviewApprovalSchema = z.object({
  id: z.string(),
  status: z.enum(['APPROVED', 'REJECTED']),
  remarks: z.string().optional(),
  rejectionReason: z.string().optional(),
})

export const bulkReviewApprovalsSchema = z.object({
  approvalIds: z.array(z.string()).min(1, 'At least one approval must be selected'),
  status: z.enum(['APPROVED', 'REJECTED']),
  remarks: z.string().optional(),
})

export type CreateApprovalInput = z.infer<typeof createApprovalSchema>
export type ReviewApprovalInput = z.infer<typeof reviewApprovalSchema>
export type BulkReviewApprovalsInput = z.infer<typeof bulkReviewApprovalsSchema>

// Made with Bob

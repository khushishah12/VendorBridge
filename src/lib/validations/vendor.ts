import { z } from 'zod'

export const createVendorSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  gstNumber: z.string().min(15, 'Valid GST number is required').max(15),
  panNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().default('India'),
  category: z.string().min(1, 'Category is required'),
  subCategories: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
})

export const updateVendorSchema = createVendorSchema.partial().extend({
  id: z.string(),
})

export const updateVendorStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE', 'BLACKLISTED']),
  blacklistReason: z.string().optional(),
})

export const rateVendorSchema = z.object({
  id: z.string(),
  rating: z.number().min(0).max(5),
})

export type CreateVendorInput = z.infer<typeof createVendorSchema>
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>
export type UpdateVendorStatusInput = z.infer<typeof updateVendorStatusSchema>
export type RateVendorInput = z.infer<typeof rateVendorSchema>

// Made with Bob

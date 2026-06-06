import { NextRequest } from 'next/server'
import { authenticate, authorize, ApiResponse } from '@/lib/middleware'
import { updateVendorSchema } from '@/lib/validations/vendor'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// GET /api/vendors/[id] - Get vendor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authResult = await authenticate(request)
  if (authResult instanceof Response) return authResult
  const { user } = authResult

  const authzResult = authorize(user, ['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'])
  if (authzResult) return authzResult

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
            lastActive: true,
          },
        },
        quotations: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            rfq: {
              select: {
                id: true,
                rfqNumber: true,
                title: true,
              },
            },
          },
        },
        purchaseOrders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!vendor) {
      return ApiResponse.notFound('Vendor not found')
    }

    return ApiResponse.success(vendor)
  } catch (error) {
    console.error('Get vendor error:', error)
    return ApiResponse.serverError('Failed to fetch vendor', error)
  }
}

// PATCH /api/vendors/[id] - Update vendor
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authResult = await authenticate(request)
  if (authResult instanceof Response) return authResult
  const { user } = authResult

  const authzResult = authorize(user, ['ADMIN', 'PROCUREMENT_OFFICER'])
  if (authzResult) return authzResult

  try {
    const body = await request.json()
    const validatedData = updateVendorSchema.parse({ ...body, id })

    const vendor = await prisma.vendor.findUnique({
      where: { id },
    })

    if (!vendor) {
      return ApiResponse.notFound('Vendor not found')
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: {
        companyName: validatedData.companyName,
        contactPerson: validatedData.contactPerson,
        email: validatedData.email,
        phone: validatedData.phone,
        gstNumber: validatedData.gstNumber,
        panNumber: validatedData.panNumber,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode,
        country: validatedData.country,
        category: validatedData.category,
        subCategories: validatedData.subCategories,
        certifications: validatedData.certifications,
        bankName: validatedData.bankName,
        accountNumber: validatedData.accountNumber,
        ifscCode: validatedData.ifscCode,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
          },
        },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.userId,
        action: 'Vendor Updated',
        entityType: 'Vendor',
        entityId: updatedVendor.id,
        details: `Vendor updated: ${updatedVendor.companyName}`,
      },
    })

    return ApiResponse.success(updatedVendor, 'Vendor updated successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponse.error('Validation failed', error.issues, 400)
    }

    console.error('Update vendor error:', error)
    return ApiResponse.serverError('Failed to update vendor', error)
  }
}

// DELETE /api/vendors/[id] - Delete vendor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authResult = await authenticate(request)
  if (authResult instanceof Response) return authResult
  const { user } = authResult

  const authzResult = authorize(user, ['ADMIN'])
  if (authzResult) return authzResult

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    })

    if (!vendor) {
      return ApiResponse.notFound('Vendor not found')
    }

    await prisma.vendor.delete({
      where: { id },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.userId,
        action: 'Vendor Deleted',
        entityType: 'Vendor',
        entityId: id,
        details: `Vendor deleted: ${vendor.companyName}`,
      },
    })

    return ApiResponse.success(null, 'Vendor deleted successfully')
  } catch (error) {
    console.error('Delete vendor error:', error)
    return ApiResponse.serverError('Failed to delete vendor', error)
  }
}

// Made with Bob

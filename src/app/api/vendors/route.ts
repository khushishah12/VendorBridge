import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { ApiResponse } from '@/lib/middleware'
import { createVendorSchema } from '@/lib/validations/vendor'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// GET /api/vendors - List all vendors
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status
    if (category) where.category = category

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
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
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vendor.count({ where }),
    ])

    return ApiResponse.success({
      vendors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get vendors error:', error)
    return ApiResponse.serverError('Failed to fetch vendors', error)
  }
}, ['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'])

// POST /api/vendors - Create new vendor
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json()
    const validatedData = createVendorSchema.parse(body)

    // Check if vendor with email or GST already exists
    const existingVendor = await prisma.vendor.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { gstNumber: validatedData.gstNumber },
        ],
      },
    })

    if (existingVendor) {
      return ApiResponse.error('Vendor with this email or GST number already exists', null, 409)
    }

    // Create user account for vendor
    const vendorUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: await require('@/lib/auth').hashPassword('TempPassword@123'), // Temporary password
        name: validatedData.contactPerson,
        phone: validatedData.phone,
        role: 'VENDOR',
        companyName: validatedData.companyName,
        gstNumber: validatedData.gstNumber,
        isVerified: false,
      },
    })

    // Create vendor profile
    const vendor = await prisma.vendor.create({
      data: {
        userId: vendorUser.id,
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
        country: validatedData.country || 'India',
        category: validatedData.category,
        subCategories: validatedData.subCategories || [],
        certifications: validatedData.certifications || [],
        bankName: validatedData.bankName,
        accountNumber: validatedData.accountNumber,
        ifscCode: validatedData.ifscCode,
        status: 'PENDING',
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
        action: 'Vendor Created',
        entityType: 'Vendor',
        entityId: vendor.id,
        details: `New vendor created: ${vendor.companyName}`,
      },
    })

    return ApiResponse.created(vendor, 'Vendor created successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponse.error('Validation failed', error.issues, 400)
    }

    console.error('Create vendor error:', error)
    return ApiResponse.serverError('Failed to create vendor', error)
  }
}, ['ADMIN', 'PROCUREMENT_OFFICER'])

// Made with Bob

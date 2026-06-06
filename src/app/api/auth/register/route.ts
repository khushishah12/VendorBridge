import { NextRequest } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { hashPassword, generateToken } from '@/lib/auth'
import { ApiResponse } from '@/lib/middleware'
import prisma from '@/lib/prisma'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return ApiResponse.error('User with this email already exists', null, 409)
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user and vendor if VENDOR role
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          phone: validatedData.phone,
          role: validatedData.role,
          department: validatedData.department,
          companyName: validatedData.companyName,
          gstNumber: validatedData.gstNumber,
          website: validatedData.website,
          isVerified: true, // Mark verified since OTP verification is done in wizard
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
        },
      })

      // If user is a vendor, create vendor profile
      if (validatedData.role === 'VENDOR' && validatedData.companyName && validatedData.gstNumber) {
        await tx.vendor.create({
          data: {
            userId: newUser.id,
            companyName: validatedData.companyName,
            contactPerson: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone || '',
            gstNumber: validatedData.gstNumber,
            category: validatedData.department || 'General', // Default category or sector
            status: 'PENDING',
          },
        })
      }

      // Log activity
      await tx.activityLog.create({
        data: {
          userId: newUser.id,
          action: 'User Registration',
          entityType: 'User',
          entityId: newUser.id,
          details: `New user registered: ${newUser.email}`,
        },
      })

      return newUser
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = ApiResponse.created(
      {
        user,
        token,
      },
      'Registration successful'
    )

    // Store JWT in secure HttpOnly cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponse.error('Validation failed', error.issues, 400)
    }

    console.error('Registration error:', error)
    return ApiResponse.serverError('Registration failed', error)
  }
}

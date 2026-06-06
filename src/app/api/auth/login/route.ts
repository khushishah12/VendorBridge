import { NextRequest } from 'next/server'
import { loginSchema } from '@/lib/validations/auth'
import { verifyPassword, generateToken } from '@/lib/auth'
import { ApiResponse } from '@/lib/middleware'
import prisma from '@/lib/prisma'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = loginSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        vendor: true,
      },
    })

    if (!user) {
      return ApiResponse.error('Invalid email or password', null, 401)
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return ApiResponse.error(
        `Account is ${user.status.toLowerCase()}. Please contact administrator.`,
        null,
        403
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(validatedData.password, user.password)

    if (!isPasswordValid) {
      return ApiResponse.error('Invalid email or password', null, 401)
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'User Login',
        entityType: 'User',
        entityId: user.id,
        details: `User logged in: ${user.email}`,
      },
    })

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    const response = ApiResponse.success(
      {
        user: userWithoutPassword,
        token,
      },
      'Login successful'
    )

    // Set secure HttpOnly cookie for session persistence
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

    console.error('Login error:', error)
    return ApiResponse.serverError('Login failed', error)
  }
}

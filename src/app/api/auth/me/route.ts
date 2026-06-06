import { NextRequest } from 'next/server'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ApiResponse } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    let token = extractTokenFromHeader(authHeader)

    if (!token) {
      token = request.cookies.get('token')?.value || null
    }

    if (!token) {
      return ApiResponse.unauthorized('No session token found')
    }

    const payload = verifyToken(token)
    if (!payload) {
      return ApiResponse.unauthorized('Invalid or expired token')
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        vendor: true,
      },
    })

    if (!user) {
      return ApiResponse.notFound('User not found')
    }

    if (user.status !== 'ACTIVE') {
      return ApiResponse.forbidden('Account is not active')
    }

    const { password: _, ...userWithoutPassword } = user

    return ApiResponse.success({ user: userWithoutPassword })
  } catch (error) {
    console.error('Session retrieval error:', error)
    return ApiResponse.serverError('Failed to retrieve session', error)
  }
}

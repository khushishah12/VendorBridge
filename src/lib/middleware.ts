import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader, JWTPayload } from './auth'

export type Role = 'ADMIN' | 'MANAGER' | 'PROCUREMENT_OFFICER' | 'VENDOR'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

/**
 * Middleware to authenticate API requests
 */
export async function authenticate(request: NextRequest): Promise<{ user: JWTPayload } | NextResponse> {
  const authHeader = request.headers.get('authorization')
  let token = extractTokenFromHeader(authHeader)

  if (!token) {
    token = request.cookies.get('token')?.value || null
  }

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required', message: 'No token provided' },
      { status: 401 }
    )
  }

  const payload = verifyToken(token)

  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token', message: 'Token is invalid or expired' },
      { status: 401 }
    )
  }

  return { user: payload }
}

/**
 * Middleware to check if user has required role
 */
export function authorize(user: JWTPayload, allowedRoles: Role[]): NextResponse | null {
  if (!allowedRoles.includes(user.role as Role)) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'You do not have permission to access this resource' },
      { status: 403 }
    )
  }
  return null
}

/**
 * Helper to create protected API route handler
 */
export function withAuth(
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>,
  allowedRoles?: Role[]
) {
  return async (request: NextRequest) => {
    const authResult = await authenticate(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    if (allowedRoles) {
      const authzResult = authorize(user, allowedRoles)
      if (authzResult) {
        return authzResult
      }
    }

    return handler(request, user)
  }
}

/**
 * API Response helpers
 */
export class ApiResponse {
  static success<T>(data: T, message?: string, status: number = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    )
  }

  static error(message: string, error?: any, status: number = 400) {
    return NextResponse.json(
      {
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status }
    )
  }

  static created<T>(data: T, message: string = 'Resource created successfully') {
    return this.success(data, message, 201)
  }

  static noContent() {
    return new NextResponse(null, { status: 204 })
  }

  static notFound(message: string = 'Resource not found') {
    return this.error(message, null, 404)
  }

  static unauthorized(message: string = 'Unauthorized') {
    return this.error(message, null, 401)
  }

  static forbidden(message: string = 'Forbidden') {
    return this.error(message, null, 403)
  }

  static serverError(message: string = 'Internal server error', error?: any) {
    return this.error(message, error, 500)
  }
}

// Made with Bob

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  user?: {
    id: string;
    email: string;
  };
}

export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Token tidak ditemukan atau format token salah',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    // Attach user info to request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.userId = decoded.userId;
    authenticatedRequest.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    // Call the handler with authenticated request
    return await handler(authenticatedRequest);
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token',
          message: 'Token tidak valid',
        },
        { status: 401 }
      );
    }

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Token expired',
          message: 'Token sudah kadaluarsa, silakan login kembali',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Authentication failed',
        message: 'Autentikasi gagal',
      },
      { status: 401 }
    );
  }
}

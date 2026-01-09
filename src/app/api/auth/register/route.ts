import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { RegisterRequest, AuthResponse, ErrorResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, fullName } = body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: 'Email, password, and full name are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: 'Password must be at least 8 characters long',
        },
        { status: 422 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.userAccount.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: 'Email already registered',
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.userAccount.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Return success response
    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          },
          token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

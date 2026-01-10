import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CategoryType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const categories = await prisma.category.findMany({
      where: type ? { type: type.toUpperCase() as CategoryType } : undefined,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        message: 'Gagal mengambil data kategori',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Create a new category
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, icon } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Nama kategori harus diisi',
        },
        { status: 400 }
      );
    }

    if (!type || !['INCOME', 'EXPENSE'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Tipe kategori harus INCOME atau EXPENSE',
        },
        { status: 400 }
      );
    }

    // Check if category with same name and type already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim(),
        type: type as CategoryType,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate category',
          message: 'Kategori dengan nama dan tipe yang sama sudah ada',
        },
        { status: 400 }
      );
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        type: type as CategoryType,
        icon: icon || 'wallet', // Default to wallet if not provided
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: 'Kategori berhasil ditambahkan',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create category',
        message: 'Gagal menambahkan kategori',
      },
      { status: 500 }
    );
  }
}

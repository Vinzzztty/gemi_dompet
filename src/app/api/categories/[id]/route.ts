import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CategoryType } from '@prisma/client';

/**
 * PUT /api/categories/[id]
 * Update an existing category
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, type, icon } = body;

    // Validation
    if (name && !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Nama kategori tidak boleh kosong',
        },
        { status: 400 }
      );
    }

    if (type && !['INCOME', 'EXPENSE'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Tipe kategori harus INCOME atau EXPENSE',
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: 'Kategori tidak ditemukan',
        },
        { status: 404 }
      );
    }

    // Check for duplicate name+type (excluding current category)
    if (name && type) {
      const duplicate = await prisma.category.findFirst({
        where: {
          name: name.trim(),
          type: type as CategoryType,
          NOT: { id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: 'Duplicate category',
            message: 'Kategori dengan nama dan tipe yang sama sudah ada',
          },
          { status: 400 }
        );
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(type && { type: type as CategoryType }),
        ...(icon && { icon }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedCategory,
        message: 'Kategori berhasil diupdate',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update category',
        message: 'Gagal mengupdate kategori',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a category (only if not used in transactions)
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { incomeTransactions: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: 'Kategori tidak ditemukan',
        },
        { status: 404 }
      );
    }

    // Check if category is used in transactions
    if (category._count.incomeTransactions > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category in use',
          message: `Kategori tidak dapat dihapus karena masih digunakan oleh ${category._count.incomeTransactions} transaksi`,
        },
        { status: 400 }
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Kategori berhasil dihapus',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete category',
        message: 'Gagal menghapus kategori',
      },
      { status: 500 }
    );
  }
}

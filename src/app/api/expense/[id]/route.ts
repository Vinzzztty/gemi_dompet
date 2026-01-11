import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/expense/[id] - Get single expense
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { id } = await params;

      const expense = await prisma.expenseTransaction.findUnique({
        where: {
          id,
          userId: req.userId!, // Ensure user can only access their own data
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              type: true,
            },
          },
        },
      });

      if (!expense) {
        return NextResponse.json(
          {
            success: false,
            error: 'Not found',
            message: 'Pengeluaran tidak ditemukan',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: expense,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error fetching expense:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch expense',
          message: 'Gagal mengambil data pengeluaran',
        },
        { status: 500 }
      );
    }
  });
}

// PUT /api/expense/[id] - Update expense
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const { nama, nominal, categoryId, tanggal, catatan } = body;

      // Check if expense exists and belongs to user
      const existingExpense = await prisma.expenseTransaction.findUnique({
        where: { id, userId: req.userId! },
      });

      if (!existingExpense) {
        return NextResponse.json(
          {
            success: false,
            error: 'Not found',
            message: 'Pengeluaran tidak ditemukan',
          },
          { status: 404 }
        );
      }

      // Validation
      if (nama !== undefined && nama.trim() === '') {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            message: 'Nama transaksi harus diisi',
          },
          { status: 400 }
        );
      }

      if (nominal !== undefined && nominal <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            message: 'Nominal harus lebih besar dari 0',
          },
          { status: 400 }
        );
      }

      // Prepare update data
      const updateData: any = {};
      if (nama !== undefined) updateData.nama = nama.trim();
      if (nominal !== undefined) updateData.nominal = nominal;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (tanggal !== undefined) updateData.tanggal = new Date(tanggal);
      if (catatan !== undefined) updateData.catatan = catatan?.trim() || null;

      // Update expense
      const updatedExpense = await prisma.expenseTransaction.update({
        where: { id },
        data: updateData,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              type: true,
            },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: updatedExpense,
          message: 'Pengeluaran berhasil diperbarui',
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error updating expense:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update expense',
          message: 'Gagal memperbarui pengeluaran',
        },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/expense/[id] - Delete expense
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { id } = await params;

      // Check if expense exists and belongs to user
      const expense = await prisma.expenseTransaction.findUnique({
        where: { id, userId: req.userId! },
      });

      if (!expense) {
        return NextResponse.json(
          {
            success: false,
            error: 'Not found',
            message: 'Pengeluaran tidak ditemukan',
          },
          { status: 404 }
        );
      }

      // Delete expense
      await prisma.expenseTransaction.delete({
        where: { id },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Pengeluaran berhasil dihapus',
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error deleting expense:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete expense',
          message: 'Gagal menghapus pengeluaran',
        },
        { status: 500 }
      );
    }
  });
}

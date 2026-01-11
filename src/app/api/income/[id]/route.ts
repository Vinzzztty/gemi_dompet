import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/income/[id] - Get single income transaction
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { id } = await params;

      const income = await prisma.incomeTransaction.findUnique({
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

      if (!income) {
        return NextResponse.json(
          {
            success: false,
            error: 'Not found',
            message: 'Pemasukan tidak ditemukan',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: income,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error fetching income:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch income',
          message: 'Gagal mengambil data pemasukan',
        },
        { status: 500 }
      );
    }
  });
}

// PUT /api/income/[id] - Update income transaction
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const { nama, nominal, categoryId, tanggal, catatan } = body;

      // Check if income exists and belongs to user
      const existingIncome = await prisma.incomeTransaction.findUnique({
        where: { id, userId: req.userId! },
      });

      if (!existingIncome) {
        return NextResponse.json(
          {
            success: false,
            error: 'Not found',
            message: 'Pemasukan tidak ditemukan',
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

      // Update income
      const updatedIncome = await prisma.incomeTransaction.update({
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
          data: updatedIncome,
          message: 'Pemasukan berhasil diperbarui',
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error updating income:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update income',
          message: 'Gagal memperbarui pemasukan',
        },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/income/[id] - Delete income transaction
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { id } = await params;

      // Check if income exists and belongs to user
      const income = await prisma.incomeTransaction.findUnique({
        where: { id, userId: req.userId! },
      });

      if (!income) {
        return NextResponse.json(
          {
            success: false,
            error: 'Not found',
            message: 'Pemasukan tidak ditemukan',
          },
          { status: 404 }
        );
      }

      // Delete income
      await prisma.incomeTransaction.delete({
        where: { id },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Pemasukan berhasil dihapus',
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error deleting income:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete income',
          message: 'Gagal menghapus pemasukan',
        },
        { status: 500 }
      );
    }
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

// GET /api/expense - List expense transactions
export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const categoryId = searchParams.get('categoryId');

      const skip = (page - 1) * limit;

      // Build filters
      const where: any = {
        userId: req.userId!,
      };

      // Date filter
      if (startDate || endDate) {
        const dateFilter: any = {};
        if (startDate) dateFilter.gte = new Date(startDate);
        if (endDate) dateFilter.lte = new Date(endDate);
        where.tanggal = dateFilter;
      }

      // Category filter
      if (categoryId) {
        where.categoryId = categoryId;
      }

      // Get total count
      const total = await prisma.expenseTransaction.count({ where });

      // Fetch expenses
      const expenseTransactions = await prisma.expenseTransaction.findMany({
        where,
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
        orderBy: {
          tanggal: 'desc',
        },
        skip,
        take: limit,
      });

      return NextResponse.json(
        {
          success: true,
          data: expenseTransactions,
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error fetching expense transactions:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch expense transactions',
          message: 'Gagal mengambil data pengeluaran',
        },
        { status: 500 }
      );
    }
  });
}

// POST /api/expense - Create expense transaction
export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const body = await req.json();
      const { nama, nominal, categoryId, tanggal, catatan } = body;

      // Validation
      if (!nama || nama.trim() === '') {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            message: 'Nama transaksi harus diisi',
          },
          { status: 400 }
        );
      }

      if (!nominal || nominal <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            message: 'Nominal harus diisi dan lebih besar dari 0',
          },
          { status: 400 }
        );
      }

      if (!categoryId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            message: 'Kategori harus dipilih',
          },
          { status: 400 }
        );
      }

      if (!tanggal) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            message: 'Tanggal harus diisi',
          },
          { status: 400 }
        );
      }

      // Verify category exists and is EXPENSE type
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            error: 'Category not found',
            message: 'Kategori tidak ditemukan',
          },
          { status: 404 }
        );
      }

      if (category.type !== 'EXPENSE') {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid category type',
            message: 'Kategori harus bertipe EXPENSE',
          },
          { status: 400 }
        );
      }

      // Create expense transaction
      const expenseTransaction = await prisma.expenseTransaction.create({
        data: {
          userId: req.userId!,
          nama: nama.trim(),
          nominal,
          categoryId,
          tanggal: new Date(tanggal),
          catatan: catatan?.trim() || null,
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

      return NextResponse.json(
        {
          success: true,
          data: expenseTransaction,
          message: 'Pengeluaran berhasil ditambahkan',
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Error creating expense transaction:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create expense transaction',
          message: 'Gagal menambahkan pengeluaran',
        },
        { status: 500 }
      );
    }
  });
}

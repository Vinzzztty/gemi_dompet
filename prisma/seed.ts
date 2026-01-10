import { PrismaClient, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed Income Categories
  const incomeCategories = [
    { name: 'Gaji', type: CategoryType.INCOME },
    { name: 'Bonus', type: CategoryType.INCOME },
    { name: 'Freelance', type: CategoryType.INCOME },
    { name: 'Investasi', type: CategoryType.INCOME },
    { name: 'Hadiah', type: CategoryType.INCOME },
    { name: 'Lainnya', type: CategoryType.INCOME },
  ];

  // Seed Expense Categories (for future use)
  const expenseCategories = [
    { name: 'Makanan & Minuman', type: CategoryType.EXPENSE },
    { name: 'Transportasi', type: CategoryType.EXPENSE },
    { name: 'Belanja', type: CategoryType.EXPENSE },
    { name: 'Hiburan', type: CategoryType.EXPENSE },
    { name: 'Tagihan', type: CategoryType.EXPENSE },
    { name: 'Kesehatan', type: CategoryType.EXPENSE },
    { name: 'Pendidikan', type: CategoryType.EXPENSE },
    { name: 'Lainnya', type: CategoryType.EXPENSE },
  ];

  console.log('Creating income categories...');
  for (const category of incomeCategories) {
    await prisma.category.upsert({
      where: { name_type: { name: category.name, type: category.type } },
      update: {},
      create: category,
    });
  }

  console.log('Creating expense categories...');
  for (const category of expenseCategories) {
    await prisma.category.upsert({
      where: { name_type: { name: category.name, type: category.type } },
      update: {},
      create: category,
    });
  }

  const totalCategories = await prisma.category.count();
  console.log(`✅ Seeded ${totalCategories} categories`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

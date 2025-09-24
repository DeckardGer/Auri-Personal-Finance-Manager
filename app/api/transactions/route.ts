import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageIndex = Number(searchParams.get('pageIndex') ?? '0');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');

  const sortBy = searchParams.get('sortBy') ?? 'date';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc';

  // Get multiple merchant and category IDs
  const merchantIds = searchParams.getAll('merchantId');
  const categoryIds = searchParams.getAll('categoryId');

  const where: {
    merchant?: { id: { in: number[] } };
    category?: { id: { in: number[] } };
  } = {};

  if (merchantIds.length > 0) {
    const merchantIdNumbers = merchantIds.map((id) => Number(id));
    where.merchant = { id: { in: merchantIdNumbers } };
  }

  if (categoryIds.length > 0) {
    const categoryIdNumbers = categoryIds.map((id) => Number(id));
    where.category = { id: { in: categoryIdNumbers } };
  }

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: pageIndex * pageSize,
      take: pageSize,
      select: {
        id: true,
        amount: true,
        merchant: true,
        category: true,
        subcategory: true,
        date: true,
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({ data, total });
}

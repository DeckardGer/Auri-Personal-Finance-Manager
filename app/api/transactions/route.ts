import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageIndex = Number(searchParams.get('pageIndex') ?? '0');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');

  const sortBy = searchParams.get('sortBy') ?? 'date';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc';

  const merchantId = searchParams.get('merchantId');
  const categoryId = searchParams.get('categoryId');

  const where: {
    OR?: Array<
      | { description: { contains: string; mode: 'insensitive' } }
      | { merchant: { is: { name: { contains: string } } } }
    >;
    merchant?: { is: { id: number } };
    category?: { is: { id: number } };
  } = {};

  // Add merchant filter
  if (merchantId) {
    where.merchant = { is: { id: Number(merchantId) } };
  }

  // Add category filter
  if (categoryId) {
    where.category = { is: { id: Number(categoryId) } };
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

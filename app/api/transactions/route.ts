import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Transaction } from '@/types/transactions';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageIndex = Number(searchParams.get('pageIndex') ?? '0');
  const pageSizeParam = searchParams.get('pageSize') ?? '10';
  const pageSize = pageSizeParam === 'all' ? 'all' : Number(pageSizeParam);

  const sortBy = searchParams.get('sortBy') ?? 'date';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc';

  const merchantIdsParam = searchParams.get('merchantId');
  const categoryIdsParam = searchParams.get('categoryId');

  const where: {
    merchant?: { id: { in: number[] } };
    category?: { id: { in: number[] } };
  } = {};

  if (merchantIdsParam) {
    const merchantIds = merchantIdsParam.split(',').map((id) => Number(id.trim()));
    where.merchant = { id: { in: merchantIds } };
  }

  if (categoryIdsParam) {
    const categoryIds = categoryIdsParam.split(',').map((id) => Number(id.trim()));
    where.category = { id: { in: categoryIds } };
  }

  const [data, total]: [Transaction[], number] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      ...(pageSize !== 'all' && { skip: pageIndex * pageSize, take: pageSize }),
      select: {
        id: true,
        amount: true,
        description: true,
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

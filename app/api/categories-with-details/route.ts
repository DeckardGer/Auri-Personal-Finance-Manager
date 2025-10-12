import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CategoryWithDetails } from '@/types/categories';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageIndex = Number(searchParams.get('pageIndex') ?? '0');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');

  const name = searchParams.get('name') ?? '';

  const sortBy = searchParams.get('sortBy') ?? 'id';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc';

  const categoryIdsParam = searchParams.get('categoryId');

  const where: {
    name?: { contains: string };
    id?: { in: number[] };
  } = {};

  if (name) {
    where.name = { contains: name };
  }

  if (categoryIdsParam) {
    const categoryIds = categoryIdsParam.split(',').map((id) => Number(id.trim()));
    where.id = { in: categoryIds };
  }

  if (sortBy === 'total amount') {
    const [totals, total] = await Promise.all([
      prisma.transaction.groupBy({
        by: ['categoryId'],
        where: {
          categoryId: { not: null },
          ...where,
        },
        _sum: { amount: true },
        orderBy: { _sum: { amount: sortOrder } },
        skip: pageIndex * pageSize,
        take: pageSize,
      }),
      prisma.category.count({
        where,
      }),
    ]);

    const categoryIds = totals.map((t) => t.categoryId).filter((id) => id !== null);

    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    const sortedCategories = totals.map((t) => {
      const category = categoryMap.get(t.categoryId!)!;

      return {
        categoryId: category.id,
        categoryName: category.name,
        totalAmount: t._sum.amount ?? 0,
        transactions: category._count.transactions,
      };
    });

    return NextResponse.json({ data: sortedCategories, total });
  }

  let orderBy: Record<string, 'asc' | 'desc'> | { transactions: { _count: 'asc' | 'desc' } } = {
    [sortBy]: sortOrder,
  };

  if (sortBy === 'transactions') {
    orderBy = { transactions: { _count: sortOrder } };
  }

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy,
      skip: pageIndex * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            transactions: true,
          },
        },
        transactions: {
          select: {
            amount: true,
          },
        },
      },
    }),
    prisma.category.count({ where }),
  ]);

  const categoriesWithDetails: CategoryWithDetails[] = data.map((category) => ({
    categoryId: category.id,
    categoryName: category.name,
    totalAmount: category.transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    transactions: category._count.transactions,
  }));

  return NextResponse.json({ data: categoriesWithDetails, total });
}

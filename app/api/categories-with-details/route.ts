import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { SubcategoryWithDetails } from '@/types/categories';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageIndex = Number(searchParams.get('pageIndex') ?? '0');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');

  const name = searchParams.get('name') ?? '';

  const sortBy = searchParams.get('sortBy') ?? 'id';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc';

  const where: {
    OR?: Array<{
      name?: { contains: string };
      category?: {
        name?: { contains: string };
      };
    }>;
  } = {};

  if (name) {
    where.OR = [{ name: { contains: name } }, { category: { name: { contains: name } } }];
  }

  if (sortBy === 'total amount') {
    const [totals, total] = await Promise.all([
      prisma.transaction.groupBy({
        by: ['subcategoryId'],
        where: {
          subcategoryId: { not: null },
          subcategory: where,
        },
        _sum: { amount: true },
        orderBy: { _sum: { amount: sortOrder } },
        skip: pageIndex * pageSize,
        take: pageSize,
      }),
      prisma.subcategory.count({
        where,
      }),
    ]);

    const subcategoryIds = totals.map((t) => t.subcategoryId).filter((id) => id !== null);

    const subcategories = await prisma.subcategory.findMany({
      where: { id: { in: subcategoryIds } },
      select: {
        id: true,
        name: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    const subcategoryMap = new Map(subcategories.map((s) => [s.id, s]));

    const sortedSubcategories = totals.map((t) => {
      const subcategory = subcategoryMap.get(t.subcategoryId!)!;

      return {
        id: subcategory.id,
        name: subcategory.name,
        category: subcategory.category,
        totalAmount: t._sum.amount ?? 0,
        transactions: subcategory._count.transactions,
      };
    });

    return NextResponse.json({ data: sortedSubcategories, total });
  }

  let orderBy: Record<string, 'asc' | 'desc'> | { transactions: { _count: 'asc' | 'desc' } } = {
    [sortBy]: sortOrder,
  };

  if (sortBy === 'transactions') {
    orderBy = { transactions: { _count: sortOrder } };
  }

  const [data, total] = await Promise.all([
    prisma.subcategory.findMany({
      where,
      orderBy,
      skip: pageIndex * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
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
    prisma.subcategory.count({ where }),
  ]);

  const subcategoriesWithDetails: SubcategoryWithDetails[] = data.map((subcategory) => ({
    id: subcategory.id,
    name: subcategory.name,
    category: subcategory.category,
    totalAmount: subcategory.transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    transactions: subcategory._count.transactions,
  }));

  return NextResponse.json({ data: subcategoriesWithDetails, total });
}

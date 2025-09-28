import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { MerchantWithDetails } from '@/types/merchants';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageIndex = Number(searchParams.get('pageIndex') ?? '0');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');

  const name = searchParams.get('name') ?? '';

  const sortBy = searchParams.get('sortBy') ?? 'id';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc';

  if (sortBy === 'total amount') {
    const [totals, total] = await Promise.all([
      prisma.transaction.groupBy({
        by: ['merchantId'],
        where: {
          merchantId: {
            not: null,
          },
          merchant: {
            name: {
              contains: name,
            },
          },
        },
        _sum: { amount: true },
        orderBy: { _sum: { amount: sortOrder } },
        skip: pageIndex * pageSize,
        take: pageSize,
      }),
      prisma.merchant.count({
        where: {
          name: {
            contains: name,
          },
        },
      }),
    ]);

    const merchantIds = totals.map((t) => t.merchantId).filter((id) => id !== null);

    const merchants = await prisma.merchant.findMany({
      where: { id: { in: merchantIds } },
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

    const merchantMap = new Map(merchants.map((m) => [m.id, m]));

    const sortedMerchants = totals.map((t) => {
      const merchant = merchantMap.get(t.merchantId!)!;

      return {
        id: merchant.id,
        name: merchant.name,
        totalAmount: t._sum.amount ?? 0,
        transactions: merchant._count.transactions,
      };
    });

    return NextResponse.json({ data: sortedMerchants, total });
  }

  const [data, total] = await Promise.all([
    prisma.merchant.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      orderBy: { [sortBy]: sortOrder },
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
    prisma.merchant.count(),
  ]);

  const merchantsWithDetails: MerchantWithDetails[] = data.map((merchant) => ({
    id: merchant.id,
    name: merchant.name,
    totalAmount: merchant.transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    transactions: merchant._count.transactions,
  }));

  return NextResponse.json({ data: merchantsWithDetails, total });
}

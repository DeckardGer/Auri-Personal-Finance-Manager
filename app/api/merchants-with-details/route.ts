import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageIndex = Number(searchParams.get('pageIndex') ?? '0');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');

  const name = searchParams.get('name') ?? '';

  const sortBy = searchParams.get('sortBy') ?? 'id';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc';

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
      },
    }),
    prisma.merchant.count(),
  ]);

  // TODO: Update
  const merchantsWithDetails = data.map((merchant) => ({
    ...merchant,
    totalAmount: 0,
    numberOfTransactions: 0,
  }));

  return NextResponse.json({ data: merchantsWithDetails, total });
}

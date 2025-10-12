import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const merchants = await prisma.merchant.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(merchants);
}

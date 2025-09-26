import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      subcategories: {
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(categories);
}

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Category } from '@/types/categories';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const includeSubcategories = searchParams.get('includeSubcategories') === 'true';

  const categories: Category[] = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      subcategories: includeSubcategories
        ? {
            select: {
              id: true,
              name: true,
            },
            orderBy: {
              name: 'asc',
            },
          }
        : undefined,
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(categories);
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionWithMinimal } from '@/types/transactions';

export async function GET() {
  try {
    // Get 3 most recent transactions
    const recentTransactions: TransactionWithMinimal[] = await prisma.transaction.findMany({
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
        merchant: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 3,
    });

    // Get 3 most recent incomes (positive amounts)
    const recentIncomes: TransactionWithMinimal[] = await prisma.transaction.findMany({
      where: {
        amount: {
          gt: 0,
        },
      },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
        merchant: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 3,
    });

    // Get 3 most recent expenses (negative amounts)
    const recentExpenses: TransactionWithMinimal[] = await prisma.transaction.findMany({
      where: {
        amount: {
          lt: 0,
        },
      },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
        merchant: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 3,
    });

    return NextResponse.json({
      recentTransactions,
      recentIncomes,
      recentExpenses,
    });
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch recent transactions' }, { status: 500 });
  }
}

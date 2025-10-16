import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { CardData } from '@/types/charts';

export async function GET() {
  const currentDate = new Date();
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const twoMonthsAgo = new Date(currentDate);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const balanceCurrentPeriod = await prisma.transaction.aggregate({
    where: {
      date: {
        gte: oneMonthAgo,
        lte: currentDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const balancePreviousPeriod = await prisma.transaction.aggregate({
    where: {
      date: {
        gte: twoMonthsAgo,
        lte: oneMonthAgo,
      },
    },
    _sum: {
      amount: true,
    },
  });

  let percentage = 0;
  if (balancePreviousPeriod._sum.amount !== null && balanceCurrentPeriod._sum.amount !== null) {
    percentage =
      (balanceCurrentPeriod._sum.amount - balancePreviousPeriod._sum.amount) /
      balancePreviousPeriod._sum.amount;
  }

  const cardData: CardData = {
    value: balanceCurrentPeriod._sum.amount || 0,
    percentage,
  };

  return NextResponse.json(cardData);
}

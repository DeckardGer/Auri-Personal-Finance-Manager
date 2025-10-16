import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { CardData } from '@/types/charts';

export async function GET() {
  const currentDate = new Date();
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const twoMonthsAgo = new Date(currentDate);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const incomeCurrentPeriod = await prisma.transaction.aggregate({
    where: {
      date: {
        gte: oneMonthAgo,
        lte: currentDate,
      },
      amount: {
        gt: 0,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const incomePreviousPeriod = await prisma.transaction.aggregate({
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
  if (incomePreviousPeriod._sum.amount !== null && incomeCurrentPeriod._sum.amount !== null) {
    percentage =
      (incomeCurrentPeriod._sum.amount - incomePreviousPeriod._sum.amount) /
      incomePreviousPeriod._sum.amount;
  }

  const cardData: CardData = {
    value: incomeCurrentPeriod._sum.amount || 0,
    percentage,
  };

  return NextResponse.json(cardData);
}

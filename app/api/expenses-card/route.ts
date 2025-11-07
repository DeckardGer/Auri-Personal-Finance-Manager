import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { CardData } from '@/types/charts';

export async function GET() {
  const currentDate = new Date();
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const twoMonthsAgo = new Date(currentDate);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  // Get ignored merchant IDs in a single query
  const userSettings = await prisma.userSettings.findFirst({
    include: {
      ignoredMerchants: {
        select: { merchantId: true },
      },
    },
  });
  const ignoredMerchantIds = userSettings?.ignoredMerchants.map((im) => im.merchantId) || [];

  const expensesCurrentPeriod = await prisma.transaction.aggregate({
    where: {
      date: {
        gte: oneMonthAgo,
        lte: currentDate,
      },
      amount: {
        lt: 0,
      },
      merchantId: {
        notIn: ignoredMerchantIds.length > 0 ? ignoredMerchantIds : undefined,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const expensesPreviousPeriod = await prisma.transaction.aggregate({
    where: {
      date: {
        gte: twoMonthsAgo,
        lte: oneMonthAgo,
      },
      merchantId: {
        notIn: ignoredMerchantIds.length > 0 ? ignoredMerchantIds : undefined,
      },
    },
    _sum: {
      amount: true,
    },
  });

  let percentage = 0;
  if (expensesPreviousPeriod._sum.amount !== null && expensesCurrentPeriod._sum.amount !== null) {
    percentage =
      (expensesCurrentPeriod._sum.amount - expensesPreviousPeriod._sum.amount) /
      expensesPreviousPeriod._sum.amount;
  }

  const cardData: CardData = {
    value: expensesCurrentPeriod._sum.amount || 0,
    percentage,
  };

  return NextResponse.json(cardData);
}

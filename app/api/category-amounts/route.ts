import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CategoryAmountChartData } from '@/types/charts';

async function getYearCategoryPercentages() {
  const currentDate = new Date();
  const oneYearAgo = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  // Get ignored merchant IDs in a single query
  const userSettings = await prisma.userSettings.findFirst({
    include: {
      ignoredMerchants: {
        select: { merchantId: true },
      },
    },
  });
  const ignoredMerchantIds = userSettings?.ignoredMerchants.map((im) => im.merchantId) || [];

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: oneYearAgo,
      },
      amount: {
        lt: 0,
      },
      merchantId: {
        notIn: ignoredMerchantIds.length > 0 ? ignoredMerchantIds : undefined,
      },
    },
    select: {
      amount: true,
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  const data = transactions.reduce(
    (acc, transaction) => {
      const category = transaction.category;
      const amount = transaction.amount;

      const categoryName = category?.name || 'Uncategorised';

      if (!acc[categoryName]) {
        acc[categoryName] = { amount: 0, count: 0 };
      }

      acc[categoryName].amount += Math.abs(amount);
      acc[categoryName].count += 1;

      return acc;
    },
    {} as Record<string, { amount: number; count: number }>
  );

  const totalAmount = transactions.reduce(
    (acc, transaction) => acc + Math.abs(transaction.amount),
    0
  );

  const chartData = Object.entries(data)
    .map(([categoryName, { amount, count }]) => ({
      category: categoryName,
      percentage: (amount / totalAmount) * 100,
      amount,
      count,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    data: chartData,
    description: 'Expenses (Last Year)',
  };
}

async function getDecadeCategoryPercentages() {
  const currentDate = new Date();
  const oneDecadeAgo = new Date(currentDate.getFullYear() - 10);

  // Get ignored merchant IDs in a single query
  const userSettings = await prisma.userSettings.findFirst({
    include: {
      ignoredMerchants: {
        select: { merchantId: true },
      },
    },
  });
  const ignoredMerchantIds = userSettings?.ignoredMerchants.map((im) => im.merchantId) || [];

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: oneDecadeAgo,
      },
      amount: {
        lt: 0,
      },
      merchantId: {
        notIn: ignoredMerchantIds.length > 0 ? ignoredMerchantIds : undefined,
      },
    },
    select: {
      amount: true,
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  const data = transactions.reduce(
    (acc, transaction) => {
      const category = transaction.category;
      const amount = transaction.amount;

      const categoryName = category?.name || 'Uncategorised';

      if (!acc[categoryName]) {
        acc[categoryName] = { amount: 0, count: 0 };
      }

      acc[categoryName].amount += Math.abs(amount);
      acc[categoryName].count += 1;

      return acc;
    },
    {} as Record<string, { amount: number; count: number }>
  );

  const totalAmount = transactions.reduce(
    (acc, transaction) => acc + Math.abs(transaction.amount),
    0
  );

  const chartData = Object.entries(data)
    .map(([categoryName, { amount, count }]) => ({
      category: categoryName,
      percentage: (amount / totalAmount) * 100,
      amount,
      count,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    data: chartData,
    description: 'Expenses (Last Decade)',
  };
}

export async function GET() {
  const [
    { data: yearData, description: yearDescription },
    { data: decadeData, description: decadeDescription },
  ] = await Promise.all([getYearCategoryPercentages(), getDecadeCategoryPercentages()]);

  return NextResponse.json({
    year: { chartData: yearData, description: yearDescription },
    decade: { chartData: decadeData, description: decadeDescription },
  } satisfies CategoryAmountChartData);
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { monthIndexToString } from '@/lib/date';
import { CashflowChartData } from '@/types/charts';

async function getMonthlyCashflowData() {
  // Get current date to determine the date range for the last 12 months
  const currentDate = new Date();
  const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth() + 1, 1);
  oneYearAgo.setHours(0, 0, 0, 0);

  // Get ignored merchant IDs in a single query
  const userSettings = await prisma.userSettings.findFirst({
    include: {
      ignoredMerchants: {
        select: { merchantId: true },
      },
    },
  });
  const ignoredMerchantIds = userSettings?.ignoredMerchants.map((im) => im.merchantId) || [];

  // Fetch all transactions from the last year
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: oneYearAgo,
        lte: currentDate,
      },
      merchantId: {
        notIn: ignoredMerchantIds.length > 0 ? ignoredMerchantIds : undefined,
      },
    },
    select: {
      amount: true,
      date: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  // Group transactions by month and year
  const monthlyData = new Map<string, { month: number; income: number; expenses: number }>();

  const lastTransactionDate = transactions[transactions.length - 1].date;
  const monthsDiff = Math.max(
    0,
    (lastTransactionDate.getFullYear() - oneYearAgo.getFullYear()) * 12 +
      (lastTransactionDate.getMonth() - oneYearAgo.getMonth())
  );

  // Create all months from the last year
  for (let i = 0; i < 12 - monthsDiff; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month.toString().padStart(2, '0')}`;

    monthlyData.set(key, {
      month,
      income: 0,
      expenses: 0,
    });
  }

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month.toString().padStart(2, '0')}`;

    if (!monthlyData.has(key)) {
      console.error(`Month ${key} not found in monthlyData`);
      return;
    }

    const data = monthlyData.get(key)!;

    if (transaction.amount > 0) data.income += transaction.amount;
    else data.expenses += Math.abs(transaction.amount);
  });

  const data = Array.from(monthlyData.values())
    .map((data) => ({
      month: monthIndexToString(data.month),
      income: data.income,
      expenses: data.expenses,
    }))
    .reverse();

  const description = `${monthIndexToString(oneYearAgo.getMonth() + 1 + monthsDiff)} ${oneYearAgo.getFullYear() + Math.floor((oneYearAgo.getMonth() + monthsDiff) / 12)} - ${monthIndexToString(currentDate.getMonth() + 1)} ${currentDate.getFullYear()}`;

  return { data, description };
}

async function getYearlyCashflowData() {
  // Get current date to determine the date range for the last 10 years
  const currentDate = new Date();
  const tenYearsAgo = new Date(currentDate.getFullYear() - 9, 0, 1); // January 1st of 10 years ago
  tenYearsAgo.setHours(0, 0, 0, 0);

  // Get ignored merchant IDs in a single query
  const userSettings = await prisma.userSettings.findFirst({
    include: {
      ignoredMerchants: {
        select: { merchantId: true },
      },
    },
  });
  const ignoredMerchantIds = userSettings?.ignoredMerchants.map((im) => im.merchantId) || [];

  // Fetch all transactions from the last 10 years
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: tenYearsAgo,
        lte: currentDate,
      },
      merchantId: {
        notIn: ignoredMerchantIds.length > 0 ? ignoredMerchantIds : undefined,
      },
    },
    select: {
      amount: true,
      date: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  // Group transactions by month and year
  const yearlyData = new Map<number, { year: number; income: number; expenses: number }>();

  const lastTransactionDate = transactions[transactions.length - 1].date;
  const yearsDiff = Math.max(0, lastTransactionDate.getFullYear() - tenYearsAgo.getFullYear());

  // Create all years from the last 10 years
  for (let i = 0; i < 10 - yearsDiff; i++) {
    const year = currentDate.getFullYear() - i;

    yearlyData.set(year, {
      year,
      income: 0,
      expenses: 0,
    });
  }

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();

    if (!yearlyData.has(year)) {
      console.error(`Year ${year} not found in yearlyData`);
      return;
    }

    const data = yearlyData.get(year)!;

    if (transaction.amount > 0) data.income += transaction.amount;
    else data.expenses += Math.abs(transaction.amount);
  });

  const data = Array.from(yearlyData.values())
    .map((data) => ({
      year: data.year,
      income: data.income,
      expenses: data.expenses,
    }))
    .reverse();

  const description = `${tenYearsAgo.getFullYear() + yearsDiff} - ${currentDate.getFullYear()}`;

  return { data, description };
}

export async function GET() {
  const [
    { data: monthlyData, description: monthlyDescription },
    { data: yearlyData, description: yearlyDescription },
  ] = await Promise.all([getMonthlyCashflowData(), getYearlyCashflowData()]);

  return NextResponse.json({
    monthly: { chartData: monthlyData, description: monthlyDescription },
    yearly: { chartData: yearlyData, description: yearlyDescription },
  } satisfies CashflowChartData);
}

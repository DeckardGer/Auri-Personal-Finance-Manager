import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { monthIndexToString } from '@/lib/date';
import { CashflowChartData } from '@/types/charts';

async function getMonthlyCashflowData() {
  // Get current date to determine the date range for the last 12 months
  const currentDate = new Date();
  const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth() + 1, 1);
  oneYearAgo.setDate(1);
  oneYearAgo.setHours(0, 0, 0, 0);

  // Fetch all transactions from the last year
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: oneYearAgo,
        lte: currentDate,
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
  const monthlyData = new Map();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month.toString().padStart(2, '0')}`;

    if (!monthlyData.has(key)) {
      monthlyData.set(key, {
        year,
        month,
        income: 0,
        expenses: 0,
      });
    }

    const data = monthlyData.get(key)!;
    if (transaction.amount > 0) {
      data.income += transaction.amount;
    } else {
      data.expenses += Math.abs(transaction.amount);
    }
  });

  // Ensure all 12 months from the last year are included
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month.toString().padStart(2, '0')}`;

    if (!monthlyData.has(key)) {
      monthlyData.set(key, {
        year,
        month,
        income: 0,
        expenses: 0,
      });
    }
  }

  // Convert to arrays and sort by year and month (newest first)
  const data = Array.from(monthlyData.values())
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .map((data) => ({
      month: monthIndexToString(data.month),
      income: data.income,
      expenses: data.expenses,
    }));

  const description = `${monthIndexToString(oneYearAgo.getMonth() + 1)} ${oneYearAgo.getFullYear()} - ${monthIndexToString(currentDate.getMonth() + 1)} ${currentDate.getFullYear()}`;

  return { data, description };
}

async function getYearlyCashflowData() {
  // Get current date to determine the date range for the last 12 years
  const currentDate = new Date();
  const twelveYearsAgo = new Date(currentDate.getFullYear() - 11, 0, 1); // January 1st of 12 years ago
  twelveYearsAgo.setHours(0, 0, 0, 0);

  // Fetch all transactions from the last 12 years
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: twelveYearsAgo,
        lte: currentDate,
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
  const yearlyData = new Map();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();

    if (!yearlyData.has(year)) {
      yearlyData.set(year, {
        year,
        income: 0,
        expenses: 0,
      });
    }

    const data = yearlyData.get(year)!;
    if (transaction.amount > 0) {
      data.income += transaction.amount;
    } else {
      data.expenses += Math.abs(transaction.amount);
    }
  });

  // Ensure all 12 years are included
  for (let i = 0; i < 12; i++) {
    const year = currentDate.getFullYear() - i;

    if (!yearlyData.has(year)) {
      yearlyData.set(year, {
        year,
        income: 0,
        expenses: 0,
      });
    }
  }

  // Convert to arrays and sort by year (newest first)
  const data = Array.from(yearlyData.values())
    .sort((a, b) => a.year - b.year)
    .map((data) => ({
      year: data.year,
      income: data.income,
      expenses: data.expenses,
    }));

  const description = `${twelveYearsAgo.getFullYear()} - ${currentDate.getFullYear()}`;

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

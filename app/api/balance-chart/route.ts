import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { monthIndexToString } from '@/lib/date';
import { BalanceChartData } from '@/types/charts';

const WEEKS = 52;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const getYearAgoDate = (currentDate: Date) => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() - 7 * WEEKS);

  const dayOfWeek = date.getDay();
  const daysToMonday = (8 - dayOfWeek) % 7 || 7;
  date.setDate(date.getDate() + daysToMonday);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

async function getWeeklyBalanceData() {
  // Get current date and date 52 weeks ago
  const currentDate = new Date();
  const oneYearAgo = getYearAgoDate(currentDate);

  // TODO: Save current balance as a property associated with the user. Update as required
  const totalBalance = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
  });

  // Fetch all transactions from the last 52 weeks starting from nearest Monday
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

  if (!transactions.length) {
    return {
      data: [],
      description: 'Weekly Balance',
    };
  }

  // Group transactions by week and calculate weekly totals
  const weeklyData = new Map<string, { date: string; balance: number }>();

  const todayKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  weeklyData.set(todayKey, {
    date: todayKey,
    balance: totalBalance._sum.amount!, // TODO: Replace
  });

  const lastTransactionDate = transactions[transactions.length - 1].date;
  const transactionLastMonday = new Date(lastTransactionDate);
  const transactionDaysFromMonday = (transactionLastMonday.getDay() + 6) % 7;
  transactionLastMonday.setDate(transactionLastMonday.getDate() - transactionDaysFromMonday);
  transactionLastMonday.setHours(0, 0, 0, 0);

  const weeksDiff = Math.max(
    0,
    Math.floor((transactionLastMonday.getTime() - oneYearAgo.getTime()) / MS_PER_WEEK)
  );

  // Get currentDate's previous monday start date
  const lastMonday = new Date(currentDate);
  const daysFromMonday = (lastMonday.getDay() + 6) % 7;
  lastMonday.setDate(lastMonday.getDate() - daysFromMonday);
  lastMonday.setHours(0, 0, 0, 0);

  let currentBalance = totalBalance._sum.amount || 0;
  let transactionIndex = 0;

  for (let i = 0; i < WEEKS - weeksDiff; i++) {
    const weekStart = new Date(
      lastMonday.getFullYear(),
      lastMonday.getMonth(),
      lastMonday.getDate() - i * 7
    );

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Calculate total amount for this week using index tracking
    let weekTotal = 0;
    while (transactionIndex < transactions.length) {
      const transaction = transactions[transactionIndex];
      const transactionDate = new Date(transaction.date);

      // If transaction is before or after this week, break
      if (transactionDate < weekStart || transactionDate > weekEnd) {
        break;
      }

      weekTotal += transaction.amount;
      transactionIndex++;
    }

    currentBalance -= weekTotal;

    // Set balance for this week (current balance minus this week's transactions)
    const year = weekStart.getFullYear();
    const month = weekStart.getMonth() + 1;
    const day = weekStart.getDate();
    const key = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    if (!weeklyData.has(key)) {
      weeklyData.set(key, {
        date: key,
        balance: currentBalance,
      });
    }
  }

  const data = Array.from(weeklyData.values())
    .map((data) => ({
      date: data.date,
      balance: data.balance,
    }))
    .reverse();

  const startPeriodDate = new Date(oneYearAgo);
  startPeriodDate.setDate(startPeriodDate.getDate() + weeksDiff * 7);
  const description = `${monthIndexToString(startPeriodDate.getMonth() + 1)} ${startPeriodDate.getFullYear()} - ${monthIndexToString(currentDate.getMonth() + 1)} ${currentDate.getFullYear()}`;

  return { data, description };
}

async function getMonthlyBalanceData() {
  // Get current date and date 10 years ago
  const currentDate = new Date();
  const tenYearsAgo = new Date(currentDate.getFullYear() - 10, currentDate.getMonth() + 1, 1);
  tenYearsAgo.setDate(1);
  tenYearsAgo.setHours(0, 0, 0, 0);

  // TODO: Save current balance as a property associated with the user. Update as required
  const totalBalance = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
  });

  // Fetch all transactions from the last 10 years
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: tenYearsAgo,
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

  if (!transactions.length) {
    return {
      data: [],
      description: 'Monthly Balance',
    };
  }

  // Group transactions by month and calculate monthly totals
  const monthlyData = new Map<string, { date: string; balance: number }>();

  const todayKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  monthlyData.set(todayKey, {
    date: todayKey,
    balance: totalBalance._sum.amount!, // TODO: Replace
  });

  const lastTransactionDate = transactions[transactions.length - 1].date;

  const monthsDiff = Math.max(
    0,
    (lastTransactionDate.getFullYear() - tenYearsAgo.getFullYear()) * 12 +
      (lastTransactionDate.getMonth() - tenYearsAgo.getMonth())
  );

  // Get currentDate's latest month start date
  const monthStartDate = new Date(currentDate);
  monthStartDate.setDate(1);
  monthStartDate.setHours(0, 0, 0, 0);

  let currentBalance = totalBalance._sum.amount || 0;
  let transactionIndex = 0;

  for (let i = 0; i < 120 - monthsDiff; i++) {
    const monthStart = new Date(
      monthStartDate.getFullYear(),
      monthStartDate.getMonth() - i,
      monthStartDate.getDate()
    );

    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setMilliseconds(-1);

    // Calculate total amount for this month using index tracking
    let monthTotal = 0;
    while (transactionIndex < transactions.length) {
      const transaction = transactions[transactionIndex];
      const transactionDate = new Date(transaction.date);

      // If transaction is before or after this month, break
      if (transactionDate < monthStart || transactionDate > monthEnd) {
        break;
      }

      monthTotal += transaction.amount;
      transactionIndex++;
    }

    currentBalance -= monthTotal;

    // Set balance for this month (current balance minus this month's transactions)
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth() + 1;
    const key = `${year}-${month.toString().padStart(2, '0')}-01`;

    if (!monthlyData.has(key)) {
      monthlyData.set(key, {
        date: key,
        balance: currentBalance,
      });
    }
  }

  const data = Array.from(monthlyData.values())
    .map((data) => ({
      date: data.date,
      balance: data.balance,
    }))
    .reverse();

  const description = `${monthIndexToString(tenYearsAgo.getMonth() + 1 + monthsDiff)} ${tenYearsAgo.getFullYear() + Math.floor((tenYearsAgo.getMonth() + monthsDiff) / 12)} - ${monthIndexToString(currentDate.getMonth() + 1)} ${currentDate.getFullYear()}`;

  return { data, description };
}

export async function GET() {
  const [
    { data: weeklyData, description: weeklyDescription },
    { data: monthlyData, description: monthlyDescription },
  ] = await Promise.all([getWeeklyBalanceData(), getMonthlyBalanceData()]);

  return NextResponse.json({
    weekly: { chartData: weeklyData, description: weeklyDescription },
    monthly: { chartData: monthlyData, description: monthlyDescription },
  } satisfies BalanceChartData);
}

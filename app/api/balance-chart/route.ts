import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BalanceChartData } from '@/types/charts';

const WEEKS = 52;

const getYearAgoDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7 * WEEKS);

  const dayOfWeek = date.getDay();
  const daysToMonday = (8 - dayOfWeek) % 7 || 7;
  date.setDate(date.getDate() + daysToMonday);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

async function getWeeklyBalanceData() {
  // Get current date and date 52 weeks ago
  const currentDate = new Date();
  const oneYearAgo = getYearAgoDate();

  // TODO: Change to column property
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

  // Group transactions by week and calculate weekly totals
  const weeklyData = new Map();

  const todayKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  weeklyData.set(todayKey, {
    date: todayKey,
    balance: totalBalance._sum.amount,
  });

  // Get currentDate's latest monday start date
  const lastMonday = new Date(currentDate);
  const dayOfWeek = lastMonday.getDay();
  const daysToMonday = (dayOfWeek + 6) % 7 || 7;
  lastMonday.setDate(lastMonday.getDate() - daysToMonday);
  lastMonday.setHours(0, 0, 0, 0);

  let currentBalance = totalBalance._sum.amount || 0;
  let transactionIndex = 0;

  for (let i = 0; i < WEEKS; i++) {
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
    const day = weekStart.getDate() - 1;
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

  const description = 'Weekly Balance';

  return { data, description };
}

async function getMonthlyBalanceData() {
  // Placeholder for monthly balance data implementation
  return { data: [], description: '' };
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

export type CashflowChartData = {
  monthly: {
    chartData: {
      month: string;
      income: number;
      expenses: number;
    }[];
    description: string;
  };
  yearly: {
    chartData: {
      year: string;
      income: number;
      expenses: number;
    }[];
    description: string;
  };
};

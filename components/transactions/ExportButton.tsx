'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useExportTransactionsStore } from '@/stores/useExportTransactionsStore';
import { FileDown } from 'lucide-react';
import type { Transaction } from '@/types/transactions';

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { getParams } = useExportTransactionsStore();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const params = getParams();

      const response = await fetch(`/api/transactions?${params}`);
      const result = await response.json();

      if (!result.data || result.data.length === 0) {
        toast.info('No transactions to export', {
          description: 'There are no transactions matching your current filters',
        });
        return;
      }

      // Convert transactions to CSV
      const transactions = result.data;
      const headers = ['Date', 'Merchant', 'Category', 'Subcategory', 'Amount'];
      const csvRows = [headers.join(',')];

      transactions.forEach((transaction: Transaction) => {
        const row = [
          new Date(transaction.date).toLocaleDateString(),
          `"${transaction.merchant?.name || ''}"`,
          `"${transaction.category?.name || ''}"`,
          `"${transaction.subcategory?.name || ''}"`,
          transaction.amount.toFixed(2),
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success('Transactions exported', {
        description: `Successfully exported ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`,
      });
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast.error('Transactions export failed', {
        description: 'An error occurred while exporting your transactions',
        action: {
          label: 'Retry',
          onClick: () => {
            setIsExporting(true);
            handleExport();
          },
        },
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full sm:w-auto"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? <Spinner /> : <FileDown />}
      {isExporting ? 'Exporting...' : 'Export'}
    </Button>
  );
}

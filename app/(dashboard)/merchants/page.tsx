import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Merchants() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Merchants</h1>
          <p className="text-sm text-secondary-foreground">
            Manage and view all the merchants where you make transactions
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-2">
          <Button className="w-full sm:w-auto">
            <Plus />
            Add Merchant
          </Button>
        </div>
      </div>
    </div>
  );
}

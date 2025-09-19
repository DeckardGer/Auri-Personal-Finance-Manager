import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Categories() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Categories</h1>
          <p className="text-sm text-secondary-foreground">
            Organise and manage your transaction categories and subcategories
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-2">
          <Button className="w-full sm:w-auto">
            <Plus />
            Add Category
          </Button>
        </div>
      </div>
    </div>
  );
}

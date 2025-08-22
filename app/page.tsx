import { Button } from '@/components/ui/button';
import { createDefaultCategories } from '@/lib/categories';

export default function Home() {
  return (
    <div>
      <Button onClick={createDefaultCategories}>Create Default Categories</Button>
    </div>
  );
}

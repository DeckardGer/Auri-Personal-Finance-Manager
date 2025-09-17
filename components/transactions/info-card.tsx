import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export function InfoCard() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Total Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>10</CardDescription>
      </CardContent>
    </Card>
  );
}

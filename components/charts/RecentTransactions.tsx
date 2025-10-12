import { use } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ItemGroup,
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import type { RecentTransactionsData } from '@/types/charts';
import { currencyFormatter } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { SquareArrowOutUpRight, TrendingUp, TrendingDown } from 'lucide-react';

export function RecentTransactions({
  recentTransactionsData,
}: {
  recentTransactionsData: Promise<RecentTransactionsData>;
}) {
  const data = use(recentTransactionsData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Show your transaction history this month.</CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" asChild>
                <HoverPrefetchLink href="/transactions">
                  <SquareArrowOutUpRight />
                </HoverPrefetchLink>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Transactions</p>
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ItemGroup className="gap-2">
              {data.recentTransactions.map((transaction) => (
                <Item key={transaction.id} variant="outline">
                  <ItemMedia
                    variant="icon"
                    className={cn(
                      'my-auto size-9',
                      transaction.amount > 0
                        ? 'border-success bg-success/20'
                        : 'border-destructive bg-destructive/20'
                    )}
                  >
                    {transaction.amount > 0 ? (
                      <TrendingUp className="size-5 text-success" />
                    ) : (
                      <TrendingDown className="size-5 text-destructive" />
                    )}
                  </ItemMedia>
                  <ItemContent className="truncate">
                    <ItemTitle className="truncate">{transaction.merchant?.name}</ItemTitle>
                    <ItemDescription className="line-clamp-1 truncate">
                      {transaction.category?.name} &#8226;{' '}
                      {new Date(transaction.date).toDateString()}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <span className="font-semibold">
                      {currencyFormatter.format(transaction.amount)}
                    </span>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </TabsContent>
          <TabsContent value="income">
            <ItemGroup className="gap-2">
              {data.recentIncomes.map((transaction) => (
                <Item key={transaction.id} variant="outline">
                  <ItemMedia
                    variant="icon"
                    className={cn(
                      'my-auto size-9',
                      transaction.amount > 0
                        ? 'border-success bg-success/20'
                        : 'border-destructive bg-destructive/20'
                    )}
                  >
                    {transaction.amount > 0 ? (
                      <TrendingUp className="size-5 text-success" />
                    ) : (
                      <TrendingDown className="size-5 text-destructive" />
                    )}
                  </ItemMedia>
                  <ItemContent className="truncate">
                    <ItemTitle className="truncate">{transaction.merchant?.name}</ItemTitle>
                    <ItemDescription className="line-clamp-1 truncate">
                      {transaction.category?.name} &#8226;{' '}
                      {new Date(transaction.date).toDateString()}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <span className="font-semibold">
                      {currencyFormatter.format(transaction.amount)}
                    </span>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </TabsContent>
          <TabsContent value="expenses">
            <ItemGroup className="gap-2">
              {data.recentExpenses.map((transaction) => (
                <Item key={transaction.id} variant="outline">
                  <ItemMedia
                    variant="icon"
                    className={cn(
                      'my-auto size-9',
                      transaction.amount > 0
                        ? 'border-success bg-success/20'
                        : 'border-destructive bg-destructive/20'
                    )}
                  >
                    {transaction.amount > 0 ? (
                      <TrendingUp className="size-5 text-success" />
                    ) : (
                      <TrendingDown className="size-5 text-destructive" />
                    )}
                  </ItemMedia>
                  <ItemContent className="truncate">
                    <ItemTitle className="truncate">{transaction.merchant?.name}</ItemTitle>
                    <ItemDescription className="line-clamp-1 truncate">
                      {transaction.category?.name} &#8226;{' '}
                      {new Date(transaction.date).toDateString()}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <span className="font-semibold">
                      {currencyFormatter.format(transaction.amount)}
                    </span>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

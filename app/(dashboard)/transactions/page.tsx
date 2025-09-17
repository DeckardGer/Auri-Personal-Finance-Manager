import { InfoCard } from '@/components/transactions/info-card';

// TODO:
// - Total transactions
// - Current balance

export default function Transactions() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0">
        <h1 className="text-xl font-medium tracking-tight">Your Transactions</h1>
        <p className="text-sm text-secondary-foreground">
          Browse your transaction history and keep track of your spending
        </p>
      </div>

      {/* Scrollable content section */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-1">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <h3 className="font-medium">Transaction {i + 1}</h3>
              <p className="text-sm text-muted-foreground">Sample transaction data</p>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="flex-shrink-0 flex gap-2 mt-4">
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
      </div> */}
    </div>
  );
}

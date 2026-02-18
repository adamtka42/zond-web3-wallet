import type { TransactionHistoryEntry } from "@/types/transactionHistory";
import { ArrowUpRight } from "lucide-react";

type TransactionHistoryItemProps = {
  transaction: TransactionHistoryEntry;
};

const TransactionHistoryItem = ({
  transaction,
}: TransactionHistoryItemProps) => {
  const { amount, tokenSymbol, status } = transaction;

  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <ArrowUpRight className="h-8 w-8 shrink-0 text-secondary" />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Send</span>
          <span
            className={`text-xs ${status ? "text-green-500" : "text-red-500"}`}
          >
            {status ? "Confirmed" : "Failed"}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">
            {amount} {tokenSymbol}
          </span>
          <span className="text-xs text-muted-foreground">—</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryItem;

import { ROUTES } from "@/router/router";
import type {
  PendingStatus,
  TransactionHistoryEntry,
} from "@/types/transactionHistory";
import { ArrowUpRight, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type TransactionHistoryItemProps = {
  transaction: TransactionHistoryEntry;
};

function getDisplayStatus(
  pendingStatus?: PendingStatus,
  status?: boolean,
): PendingStatus {
  if (pendingStatus) return pendingStatus;
  return status ? "confirmed" : "failed";
}

function getStatusColor(displayStatus: PendingStatus): string {
  switch (displayStatus) {
    case "pending":
      return "text-amber-500";
    case "confirmed":
      return "text-green-500";
    case "failed":
      return "text-red-500";
    case "replaced":
    case "cancelled":
    case "dropped":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground";
  }
}

function getStatusLabel(displayStatus: PendingStatus): string {
  switch (displayStatus) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "failed":
      return "Failed";
    case "replaced":
      return "Replaced";
    case "cancelled":
      return "Cancelled";
    case "dropped":
      return "Dropped";
    default:
      return "Unknown";
  }
}

const TransactionHistoryItem = ({
  transaction,
}: TransactionHistoryItemProps) => {
  const { amount, tokenSymbol, status, pendingStatus } = transaction;
  const navigate = useNavigate();
  const displayStatus = getDisplayStatus(pendingStatus, status);
  const isPending = displayStatus === "pending";

  const handleAction = (
    e: React.MouseEvent,
    action: "speed-up" | "cancel",
  ) => {
    e.preventDefault();
    navigate(ROUTES.TRANSACTION_DETAIL, {
      state: { transaction, action },
    });
  };

  return (
    <Link to={ROUTES.TRANSACTION_DETAIL} state={{ transaction }}>
      <div className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors hover:bg-accent">
        <ArrowUpRight className="h-8 w-8 shrink-0 text-secondary" />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Send</span>
            <span className={`text-xs ${getStatusColor(displayStatus)}`}>
              {isPending && (
                <Loader className="mr-1 inline h-3 w-3 animate-spin" />
              )}
              {getStatusLabel(displayStatus)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">
              {amount} {tokenSymbol}
            </span>
            {isPending && transaction.nonce !== undefined ? (
              <div className="mt-1 flex gap-1">
                <button
                  onClick={(e) => handleAction(e, "speed-up")}
                  className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500 hover:bg-amber-500/20"
                >
                  Speed Up
                </button>
                <button
                  onClick={(e) => handleAction(e, "cancel")}
                  className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-500 hover:bg-red-500/20"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TransactionHistoryItem;

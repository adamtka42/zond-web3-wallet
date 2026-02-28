import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/UI/AlertDialog";
import { Button } from "@/components/UI/Button";
import { getOptimalGasFee } from "@/functions/getOptimalGasFee";
import type { TransactionHistoryEntry } from "@/types/transactionHistory";
import { utils } from "@theqrl/web3";
import { Loader } from "lucide-react";

type ReplacementConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "speed-up" | "cancel";
  originalTransaction: TransactionHistoryEntry;
  estimatedNewGasFee: string;
  isProcessing: boolean;
  error: string;
  onConfirm: () => void;
};

const ReplacementConfirmationDialog = ({
  open,
  onOpenChange,
  action,
  originalTransaction,
  estimatedNewGasFee,
  isProcessing,
  error,
  onConfirm,
}: ReplacementConfirmationDialogProps) => {
  const isSpeedUp = action === "speed-up";
  const title = isSpeedUp ? "Speed Up Transaction" : "Cancel Transaction";
  const description = isSpeedUp
    ? "This will re-submit your transaction with a higher gas fee to prioritize it. The new gas fee will be at least 10% higher than the original."
    : "This will submit a self-send transaction (0 QRL to your own address) with the same nonce, effectively replacing the original transaction. You only pay gas for the empty transaction.";

  const originalGasCost =
    originalTransaction.gasUsed && originalTransaction.effectiveGasPrice
      ? utils.fromPlanck(
          Number(originalTransaction.gasUsed) *
            Number(originalTransaction.effectiveGasPrice),
          "quanta",
        )
      : "";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-80 rounded-md">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2 px-1">
          {originalGasCost && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Original gas fee</span>
              <span>{getOptimalGasFee(originalGasCost)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              New estimated gas fee
            </span>
            <span className="font-medium text-amber-500">
              {estimatedNewGasFee
                ? getOptimalGasFee(estimatedNewGasFee)
                : "Estimating..."}
            </span>
          </div>
        </div>

        {error && (
          <p className="px-1 text-xs text-red-500">{error}</p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>
            Go Back
          </AlertDialogCancel>
          <Button onClick={onConfirm} disabled={isProcessing}>
            {isProcessing && (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSpeedUp ? "Speed Up" : "Cancel Transaction"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReplacementConfirmationDialog;

import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { Separator } from "@/components/UI/Separator";
import { NATIVE_TOKEN_UNITS_OF_GAS } from "@/constants/nativeToken";
import { getOptimalGasFee } from "@/functions/getOptimalGasFee";
import { useStore } from "@/stores/store";
import type {
  PendingStatus,
  TransactionHistoryEntry,
} from "@/types/transactionHistory";
import StorageUtil from "@/utilities/storageUtil";
import { utils } from "@theqrl/web3";
import {
  Ban,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Loader,
  Zap,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import browser from "webextension-polyfill";
import BackButton from "../../../../Shared/BackButton/BackButton";
import CircuitBackground from "../../../../Shared/CircuitBackground/CircuitBackground";
import ReplacementConfirmationDialog from "./ReplacementConfirmationDialog";

const CopyableField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-start gap-2">
        <span className="break-all text-sm font-medium text-secondary">
          {value}
        </span>
        <button
          onClick={onCopy}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

function getDisplayStatus(
  pendingStatus?: PendingStatus,
  status?: boolean,
): PendingStatus {
  if (pendingStatus) return pendingStatus;
  return status ? "confirmed" : "failed";
}

function getStatusBadge(displayStatus: PendingStatus) {
  switch (displayStatus) {
    case "pending":
      return {
        className: "bg-amber-500/10 text-amber-500",
        label: "Pending",
      };
    case "confirmed":
      return {
        className: "bg-green-500/10 text-green-500",
        label: "Confirmed",
      };
    case "failed":
      return { className: "bg-red-500/10 text-red-500", label: "Failed" };
    case "replaced":
      return {
        className: "bg-muted text-muted-foreground",
        label: "Replaced",
      };
    case "cancelled":
      return {
        className: "bg-muted text-muted-foreground",
        label: "Cancelled",
      };
    case "dropped":
      return {
        className: "bg-muted text-muted-foreground",
        label: "Dropped",
      };
    default:
      return {
        className: "bg-muted text-muted-foreground",
        label: "Unknown",
      };
  }
}

const TransactionDetail = observer(() => {
  const { zondStore, lockStore, transactionHistoryStore } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = location.state
    ?.transaction as TransactionHistoryEntry | undefined;
  const initialAction = location.state?.action as
    | "speed-up"
    | "cancel"
    | undefined;

  const [speedUpDialogOpen, setSpeedUpDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [estimatedNewGasFee, setEstimatedNewGasFee] = useState("");
  const [actionError, setActionError] = useState("");

  // Open dialog automatically if navigated with an action
  useEffect(() => {
    if (initialAction === "speed-up") setSpeedUpDialogOpen(true);
    else if (initialAction === "cancel") setCancelDialogOpen(true);
  }, [initialAction]);

  const estimateReplacementGas = useCallback(
    async (tx: TransactionHistoryEntry, isCancelAction: boolean) => {
      try {
        const { baseFeePerGas, maxPriorityFeePerGas: networkPriorityFee } =
          await zondStore.getGasFeeData({ tier: "aggressive" });

        const gasLimit = isCancelAction
          ? BigInt(NATIVE_TOKEN_UNITS_OF_GAS)
          : BigInt(tx.gasLimit ?? NATIVE_TOKEN_UNITS_OF_GAS);

        // Network-based estimate
        const networkEstimate = gasLimit * (baseFeePerGas + networkPriorityFee);

        // Original cost + 10% minimum bump
        const origCost = BigInt(tx.gasUsed ?? "0") * BigInt(tx.effectiveGasPrice ?? "0");
        const minBumpedCost = origCost + (origCost * BigInt(10)) / BigInt(100);

        // Use whichever is higher
        const finalEstimate = networkEstimate > minBumpedCost ? networkEstimate : minBumpedCost;

        const estimatedCost = utils.fromPlanck(finalEstimate, "quanta");
        setEstimatedNewGasFee(estimatedCost);
      } catch {
        setEstimatedNewGasFee("");
      }
    },
    [zondStore],
  );

  useEffect(() => {
    if (speedUpDialogOpen && transaction) {
      estimateReplacementGas(transaction, false);
    } else if (cancelDialogOpen && transaction) {
      estimateReplacementGas(transaction, true);
    }
  }, [
    speedUpDialogOpen,
    cancelDialogOpen,
    transaction,
    estimateReplacementGas,
  ]);

  const handleReplacement = async (action: "speed-up" | "cancel") => {
    if (!transaction) return;
    setIsProcessing(true);
    setActionError("");

    try {
      // Determine signing method
      const isLedger = await StorageUtil.isLedgerAccount(transaction.from);
      if (isLedger) {
        setActionError("Ledger replacement transactions are not yet supported.");
        setIsProcessing(false);
        return;
      }

      const mnemonicPhrases = await lockStore.getMnemonicPhrases(
        transaction.from,
      );
      if (!mnemonicPhrases) {
        setActionError("Could not retrieve account keys. Is the wallet unlocked?");
        setIsProcessing(false);
        return;
      }

      const result = await zondStore.signAndSendReplacementTransaction(
        transaction,
        action,
        mnemonicPhrases,
        { tier: "aggressive" },
      );

      if (result.error) {
        setActionError(result.error);
        setIsProcessing(false);
        return;
      }

      if (!result.rawTransaction || !result.transactionHash) {
        setActionError("Signing succeeded but no transaction was produced.");
        setIsProcessing(false);
        return;
      }

      // Mark original as replaced/cancelled
      await transactionHistoryStore.updateTransaction(
        transaction.from,
        transaction.transactionHash,
        {
          pendingStatus: action === "speed-up" ? "replaced" : "cancelled",
          replacementTransactionHash: result.transactionHash,
          replacedByAction: action,
        },
      );

      // For Speed Up: add the replacement TX to history as pending
      // For Cancel: don't add the self-send to history (it's just a technical detail)
      if (action === "speed-up") {
        const { chainId } = await StorageUtil.getActiveBlockChain();
        const replacementEntry: TransactionHistoryEntry = {
          id: result.transactionHash,
          from: transaction.from,
          to: transaction.to,
          amount: transaction.amount,
          tokenSymbol: transaction.tokenSymbol,
          tokenName: transaction.tokenName,
          isZrc20Token: transaction.isZrc20Token,
          tokenContractAddress: transaction.tokenContractAddress,
          tokenDecimals: transaction.tokenDecimals,
          transactionHash: result.transactionHash,
          blockNumber: "",
          gasUsed: "",
          effectiveGasPrice: "",
          status: false,
          timestamp: Date.now(),
          chainId,
          pendingStatus: "pending",
          nonce: transaction.nonce,
        };

        await transactionHistoryStore.addTransaction(
          transaction.from,
          replacementEntry,
        );
      }

      // Send the replacement TX in the background (don't block navigation)
      zondStore.sendRawTransaction(result.rawTransaction).then(
        (receipt) => {
          if (action === "speed-up") {
            const isSuccess = receipt?.status?.toString() === "1";
            transactionHistoryStore.updateTransaction(
              transaction.from,
              result.transactionHash!,
              {
                pendingStatus: isSuccess ? "confirmed" : "failed",
                status: isSuccess,
                blockNumber: receipt?.blockNumber?.toString() ?? "",
                gasUsed: receipt?.gasUsed?.toString() ?? "",
                effectiveGasPrice: (receipt?.effectiveGasPrice ?? 0).toString(),
              },
            );
          }
        },
        (err) => {
          console.error("[handleReplacement] sendRawTransaction error:", err);
          if (action === "speed-up") {
            transactionHistoryStore.updateTransaction(
              transaction.from,
              result.transactionHash!,
              { pendingStatus: "failed", status: false },
            );
          }
        },
      );

      // Navigate back to history immediately
      navigate(-1);
    } catch (error) {
      setActionError(`${action === "speed-up" ? "Speed up" : "Cancel"} failed: ${error}`);
      setIsProcessing(false);
    }
  };

  if (!transaction) {
    return (
      <div className="w-full">
        <CircuitBackground />
        <div className="relative z-10 p-8">
          <BackButton />
          <Card className="w-full">
            <CardContent className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
              <FileText className="h-12 w-12" />
              <p className="text-sm">Transaction not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const {
    amount,
    tokenSymbol,
    status,
    pendingStatus,
    from,
    to,
    transactionHash,
    blockNumber,
    gasUsed,
    effectiveGasPrice,
    timestamp,
    replacementTransactionHash,
    replacedByAction,
  } = transaction;

  const displayStatus = getDisplayStatus(pendingStatus, status);
  const badge = getStatusBadge(displayStatus);
  const isPending = displayStatus === "pending";
  const canReplace =
    isPending && transaction.nonce !== undefined;

  const totalGasFeeInPlanck = Number(gasUsed) * Number(effectiveGasPrice);
  const totalGasFeeQrl = utils.fromPlanck(totalGasFeeInPlanck, "quanta");
  const gasPriceQrl = utils.fromPlanck(Number(effectiveGasPrice), "quanta");
  const totalCost = amount + Number(totalGasFeeQrl);

  const formattedDate = new Date(timestamp).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const hashWithoutPrefix = transactionHash.replace(/^0x/, "");
  const explorerTxUrl = `https://explorer.theqrl.org/tx/${hashWithoutPrefix}`;

  const openInExplorer = () => {
    if (explorerTxUrl) {
      browser.tabs.create({ url: explorerTxUrl });
    }
  };

  return (
    <div className="w-full">
      <CircuitBackground />
      <div className="relative z-10 p-8">
        <BackButton />
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${badge.className}`}
              >
                {isPending && (
                  <Loader className="mr-1 h-3 w-3 animate-spin" />
                )}
                {badge.label}
              </div>
            </div>

            {/* Speed Up / Cancel buttons for pending TXs */}
            {canReplace && (
              <>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                    onClick={() => setSpeedUpDialogOpen(true)}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Speed Up
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
                <Separator />
              </>
            )}

            {/* Replacement info for replaced/cancelled TXs */}
            {(displayStatus === "replaced" ||
              displayStatus === "cancelled") &&
              replacementTransactionHash && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      {replacedByAction === "speed-up"
                        ? "Replaced by (Speed Up)"
                        : "Cancelled by"}
                    </span>
                    <span className="break-all text-sm font-medium text-secondary">
                      {replacementTransactionHash}
                    </span>
                  </div>
                  <Separator />
                </>
              )}

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Amount</span>
              <span className="text-lg font-bold">
                {amount} {tokenSymbol}
              </span>
              <span className="text-xs text-muted-foreground">—</span>
            </div>

            <Separator />

            <CopyableField label="From" value={from} />
            <CopyableField label="To" value={to} />

            <Separator />

            <CopyableField
              label="Transaction Hash"
              value={transactionHash}
            />

            <Separator />

            {!isPending && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Block Number
                    </span>
                    <span className="text-sm font-medium">{blockNumber}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Gas Used
                    </span>
                    <span className="text-sm font-medium">
                      {Number(gasUsed).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Gas Price
                    </span>
                    <span className="text-sm font-medium">
                      {getOptimalGasFee(gasPriceQrl)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Total Gas Fee
                    </span>
                    <span className="text-sm font-medium">
                      {getOptimalGasFee(totalGasFeeQrl)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Total Cost
                  </span>
                  <span className="text-sm font-bold">
                    {getOptimalGasFee(totalCost.toString())}
                  </span>
                </div>

                <Separator />
              </>
            )}

            {isPending && (
              <div className="flex items-center gap-2 text-sm text-amber-500">
                <Loader className="h-4 w-4 animate-spin" />
                Waiting for confirmation...
              </div>
            )}

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Date & Time
              </span>
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>

            {explorerTxUrl && !isPending && (
              <>
                <Separator />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={openInExplorer}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Block Explorer
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation dialogs */}
      <ReplacementConfirmationDialog
        open={speedUpDialogOpen}
        onOpenChange={setSpeedUpDialogOpen}
        action="speed-up"
        originalTransaction={transaction}
        estimatedNewGasFee={estimatedNewGasFee}
        isProcessing={isProcessing}
        error={actionError}
        onConfirm={() => handleReplacement("speed-up")}
      />
      <ReplacementConfirmationDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        action="cancel"
        originalTransaction={transaction}
        estimatedNewGasFee={estimatedNewGasFee}
        isProcessing={isProcessing}
        error={actionError}
        onConfirm={() => handleReplacement("cancel")}
      />
    </div>
  );
});

export default TransactionDetail;

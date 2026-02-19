import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { Separator } from "@/components/UI/Separator";
import { getOptimalGasFee } from "@/functions/getOptimalGasFee";
import type { TransactionHistoryEntry } from "@/types/transactionHistory";
import { utils } from "@theqrl/web3";
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import browser from "webextension-polyfill";
import BackButton from "../../../../Shared/BackButton/BackButton";
import CircuitBackground from "../../../../Shared/CircuitBackground/CircuitBackground";

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

const TransactionDetail = () => {
  const location = useLocation();
  const transaction = location.state
    ?.transaction as TransactionHistoryEntry | undefined;

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
    from,
    to,
    transactionHash,
    blockNumber,
    gasUsed,
    effectiveGasPrice,
    timestamp,
  } = transaction;

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
            <div
              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${
                status
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {status ? "Confirmed" : "Failed"}
            </div>

            <Separator />

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

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Date & Time
              </span>
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>

            {explorerTxUrl && (
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
    </div>
  );
};

export default TransactionDetail;

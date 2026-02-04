import { Button } from "@/components/UI/Button";
import { Label } from "@/components/UI/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { getHexSeedFromMnemonic } from "@/functions/getHexSeedFromMnemonic";
import { useStore } from "@/stores/store";
import StringUtil from "@/utilities/stringUtil";
import { Copy } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { SEND_TRANSACTION_TYPES } from "../ZondSendTransaction";
import { utils, zond } from "@theqrl/web3";

const { Common } = zond.accounts;

type ZondSendTransactionForContentProps = {
  transactionType: keyof typeof SEND_TRANSACTION_TYPES;
};

const ZondSendTransactionForContent = observer(
  ({ transactionType }: ZondSendTransactionForContentProps) => {
    const { lockStore, zondStore, dAppRequestStore, ledgerStore } = useStore();
    const { getMnemonicPhrases } = lockStore;
    const { zondInstance, getGasFeeData, zondConnection } = zondStore;
    const { isConnected } = zondConnection;
    const {
      dAppRequestData,
      setOnPermissionCallBack,
      setCanProceed,
      addToResponseData,
    } = dAppRequestStore;

    const params = dAppRequestData?.params[0];
    const accountFromAddress = params?.from;
    const { prefix: prefixFrom, addressSplit: addressSplitFrom } =
      StringUtil.getSplitAddress(accountFromAddress);
    const accountToAddress = params?.to;
    const { prefix: prefixTo, addressSplit: addressSplitTo } =
      StringUtil.getSplitAddress(accountToAddress);
    const value = BigInt(params?.value);
    const gasLimit = BigInt(params?.gas);
    const data = params?.data;

    useEffect(() => {
      if (isConnected) {
        const onPermissionCallBack = async (hasApproved: boolean) => {
          if (hasApproved) {
            if (transactionType === SEND_TRANSACTION_TYPES.ZND_TRANSFER) {
              await sendZndTransfer();
            } else {
              await deployContractOrInteract();
            }
          }
        };
        setOnPermissionCallBack(onPermissionCallBack);
      }
    }, [isConnected, transactionType]);

    const copyData = () => {
      navigator.clipboard.writeText(data);
    };

    const deployContractOrInteract = async () => {
      const request = dAppRequestData?.params?.[0];
      try {
        const { from, to, data, gas, type, value } = request;

        const isLedgerAccount = ledgerStore.isLedgerAccount(from ?? "");

        const gasPrice = await zondInstance?.getGasPrice();
        let transactionObject: any = {
          from,
          ...(to && { to }),
          data,
          gas,
          value,
          nonce: await zondInstance?.getTransactionCount(from),
        };
        if (type === "0x2") {
          const { maxFeePerGas, maxPriorityFeePerGas } = await getGasFeeData();
          transactionObject.type = "0x2";
          transactionObject.maxPriorityFeePerGas = maxPriorityFeePerGas;
          transactionObject.maxFeePerGas = `0x${maxFeePerGas.toString(16)}`;
        } else {
          transactionObject.gasPrice = gasPrice;
        }

        let rawTransactionToSend: string | undefined;

        if (isLedgerAccount) {
          const chainId = await zondInstance?.getChainId();
          const common = Common.custom({ chainId: Number(chainId) });

          const txData: any = {
            nonce: `0x${transactionObject.nonce.toString(16)}`,
            gasLimit: transactionObject.gas,
            data: transactionObject.data || "0x",
            value: transactionObject.value ? `0x${BigInt(transactionObject.value).toString(16)}` : "0x0",
          };

          if (transactionObject.to) {
            txData.to = transactionObject.to;
          }

          if (transactionObject.type === "0x2") {
            txData.maxPriorityFeePerGas = transactionObject.maxPriorityFeePerGas;
            txData.maxFeePerGas = transactionObject.maxFeePerGas;
          } else {
            txData.gasPrice = `0x${BigInt(transactionObject.gasPrice).toString(16)}`;
          }

          rawTransactionToSend = await ledgerStore.signAndSerializeTransaction(from ?? "", txData, common);
        } else {
          // Regular account - use mnemonic-based signing
          const mnemonicPhrases = await getMnemonicPhrases(from ?? "");
          const signedTransaction = await zondInstance?.accounts.signTransaction(
            transactionObject,
            getHexSeedFromMnemonic(mnemonicPhrases),
          );
          rawTransactionToSend = signedTransaction?.rawTransaction;
        }

        if (rawTransactionToSend) {
          const transactionReceipt = await zondInstance?.sendSignedTransaction(
            rawTransactionToSend,
          );
          addToResponseData({
            transactionHash: transactionReceipt?.transactionHash,
          });
        } else {
          throw new Error("Transaction could not be signed");
        }
      } catch (error) {
        addToResponseData({ error });
        console.error(
          transactionType === SEND_TRANSACTION_TYPES.CONTRACT_DEPLOYMENT
            ? "Contract deployment failed:"
            : "Contract interaction failed:",
          error,
        );
      }
    };

    const sendZndTransfer = async () => {
      const request = dAppRequestData?.params?.[0];
      try {
        const { from, to, gas, type, value } = request;

        if (!from) {
          throw new Error(
            "Sender address ('from') is missing for ZND transfer.",
          );
        }
        if (!to) {
          throw new Error(
            "Recipient address ('to') is missing for ZND transfer.",
          );
        }
        if (!gas) {
          throw new Error("Gas limit ('gas') is missing for ZND transfer.");
        }
        if (value === undefined || value === null) {
          throw new Error(
            "Transfer amount ('value') is missing for ZND transfer.",
          );
        }

        const isLedgerAccount = ledgerStore.isLedgerAccount(from);

        const gasPrice = await zondInstance?.getGasPrice();
        let transactionObject: any = {
          from,
          to,
          gas,
          value,
          nonce: await zondInstance?.getTransactionCount(from),
        };

        if (type === "0x2") {
          const { maxFeePerGas, maxPriorityFeePerGas } = await getGasFeeData();
          transactionObject.type = "0x2";
          transactionObject.maxPriorityFeePerGas = maxPriorityFeePerGas;
          transactionObject.maxFeePerGas = `0x${maxFeePerGas.toString(16)}`;
        } else {
          transactionObject.gasPrice = gasPrice;
        }

        let rawTransactionToSend: string | undefined;

        if (isLedgerAccount) {
          const chainId = await zondInstance?.getChainId();
          const common = Common.custom({ chainId: Number(chainId) });

          const txData = {
            nonce: `0x${transactionObject.nonce.toString(16)}`,
            maxPriorityFeePerGas: transactionObject.maxPriorityFeePerGas,
            maxFeePerGas: transactionObject.maxFeePerGas,
            gasLimit: transactionObject.gas,
            to: transactionObject.to,
            value: `0x${BigInt(transactionObject.value).toString(16)}`,
            data: "0x",
          };

          rawTransactionToSend = await ledgerStore.signAndSerializeTransaction(from, txData, common);
        } else {
          // Regular account - use mnemonic-based signing
          const mnemonicPhrases = await getMnemonicPhrases(from ?? "");
          const signedTransaction = await zondInstance?.accounts.signTransaction(
            transactionObject,
            getHexSeedFromMnemonic(mnemonicPhrases),
          );
          rawTransactionToSend = signedTransaction?.rawTransaction;
        }

        if (rawTransactionToSend) {
          const transactionReceipt = await zondInstance?.sendSignedTransaction(
            rawTransactionToSend,
          );
          addToResponseData({
            transactionHash: transactionReceipt?.transactionHash,
          });
        } else {
          throw new Error("ZND Transfer transaction could not be signed");
        }
      } catch (error) {
        addToResponseData({ error });
        console.error("ZND Transfer failed:", error);
      }
    };
    useEffect(() => {
      setCanProceed(true);
    }, []);

    return (
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="details"
            className="w-full data-[state=active]:text-secondary"
          >
            Details
          </TabsTrigger>
          {transactionType !== SEND_TRANSACTION_TYPES.ZND_TRANSFER && (
            <TabsTrigger
              value="data"
              className="w-full data-[state=active]:text-secondary"
            >
              Data
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="details" className="rounded-md p-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div>From Address</div>
              <div className="w-64 font-bold text-secondary">{`${prefixFrom} ${addressSplitFrom.join(" ")}`}</div>
            </div>
            {(transactionType === SEND_TRANSACTION_TYPES.CONTRACT_INTERACTION ||
              transactionType === SEND_TRANSACTION_TYPES.ZND_TRANSFER) && (
              <div className="flex flex-col gap-1">
                <div>
                  {transactionType ===
                  SEND_TRANSACTION_TYPES.CONTRACT_INTERACTION
                    ? "Contract "
                    : "To "}
                  Address
                </div>
                <div className="w-64 font-bold text-secondary">{`${prefixTo} ${addressSplitTo.join(" ")}`}</div>
              </div>
            )}
            {transactionType === SEND_TRANSACTION_TYPES.ZND_TRANSFER && (
              <div className="flex flex-col gap-1">
                <div>Value</div>
                <div className="font-bold text-secondary">
                  {utils.fromWei(value, "ether")} ZND
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div>Gas Limit</div>
              <div className="font-bold text-secondary">
                {gasLimit.toString()}
              </div>
            </div>
          </div>
        </TabsContent>
        {transactionType !== SEND_TRANSACTION_TYPES.ZND_TRANSFER && (
          <TabsContent value="data" className="rounded-md p-2">
            <div className="flex flex-col gap-1">
              <div>Data</div>
              <div className="flex gap-2">
                <div className="max-h-[8rem] w-full overflow-hidden break-words font-bold text-secondary">
                  {data}
                </div>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-7 w-8 hover:text-secondary"
                      variant="outline"
                      size="icon"
                      onClick={copyData}
                    >
                      <Copy size="16" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <Label>Copy Data</Label>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    );
  },
);

export default ZondSendTransactionForContent;

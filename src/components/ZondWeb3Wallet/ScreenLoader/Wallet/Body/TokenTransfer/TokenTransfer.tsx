import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/UI/AlertDialog";
import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/UI/Card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/UI/Form";
import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";
import { NATIVE_TOKEN } from "@/constants/nativeToken";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionReceipt, validator, utils, zond } from "@theqrl/web3";
import { Loader, Send, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import BackButton from "../../../Shared/BackButton/BackButton";
import CircuitBackground from "../../../Shared/CircuitBackground/CircuitBackground";
import AccountAddressSection from "./AccountAddressSection/AccountAddressSection";
import { GasFeeNotice } from "./GasFeeNotice/GasFeeNotice";
import TokenDisplaySection from "./TokenDisplaySection/TokenDisplaySection";
import { TransactionSuccessful } from "./TransactionSuccessful/TransactionSuccessful";
import { NATIVE_TOKEN_UNITS_OF_GAS } from "@/constants/nativeToken";

const { Common } = zond.accounts;

const FormSchema = z
  .object({
    receiverAddress: z.string().min(1, "Receiver address is required"),
    amount: z.coerce.number().gt(0, "Amount should be more than 0"),
  })
  .refine((fields) => validator.isAddressString(fields.receiverAddress), {
    message: "Address is invalid",
    path: ["receiverAddress"],
  });

const TokenTransfer = observer(() => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { lockStore, zondStore, ledgerStore } = useStore();
  const { getMnemonicPhrases } = lockStore;
  const {
    activeAccount,
    signAndSendNativeToken,
    fetchAccounts,
    signAndSendZrc20Token,
    zondInstance,
    getGasFeeData,
  } = zondStore;
  const { accountAddress } = activeAccount;

  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();
  const [isZrc20Token, setIsZrc20Token] = useState(false);
  const [tokenContractAddress, setTokenContractAddress] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(0);
  const [tokenImage, setTokenImage] = useState(NATIVE_TOKEN.image);
  const [tokenBalance, setTokenBalance] = useState("");
  const [tokenName, setTokenName] = useState(NATIVE_TOKEN.name);
  const [tokenSymbol, setTokenSymbol] = useState(NATIVE_TOKEN.symbol);

  const sendNativeToken = async (formData: z.infer<typeof FormSchema>) => {
    const isLedgerAccount = ledgerStore.isLedgerAccount(accountAddress);
    if (isLedgerAccount) {
      // Ledger signing flow
      return await sendNativeTokenWithLedger(formData);
    } else {
      // Regular mnemonic-based signing
      const mnemonicPhrases = await getMnemonicPhrases(accountAddress);
      return await signAndSendNativeToken(
        accountAddress,
        formData.receiverAddress,
        formData.amount,
        mnemonicPhrases,
      );
    }
  };

  const sendNativeTokenWithLedger = async (formData: z.infer<typeof FormSchema>) => {
    let transaction: {
      transactionReceipt?: TransactionReceipt;
      error: string;
    } = { transactionReceipt: undefined, error: "" };

    try {
      const { maxFeePerGas, maxPriorityFeePerGas } = await getGasFeeData();
      const nonce = await zondInstance?.getTransactionCount(accountAddress);
      const chainId = await zondInstance?.getChainId();

      const common = Common.custom({ chainId: Number(chainId) });
      const txData = {
        nonce: `0x${(nonce ?? 0).toString(16)}`,
        maxPriorityFeePerGas: `0x${Number(maxPriorityFeePerGas).toString(16)}`,
        maxFeePerGas: `0x${Number(maxFeePerGas).toString(16)}`,
        gasLimit: `0x${BigInt(NATIVE_TOKEN_UNITS_OF_GAS).toString(16)}`,
        to: formData.receiverAddress,
        value: `0x${BigInt(utils.toWei(formData.amount, "ether")).toString(16)}`,
        data: "0x",
      };

      const signedRawTxHex = await ledgerStore.signAndSerializeTransaction(accountAddress, txData, common);
      const transactionReceipt = await zondInstance?.sendSignedTransaction(signedRawTxHex);
      transaction.transactionReceipt = transactionReceipt;
    } catch (error) {
      console.error("[TokenTransfer] Ledger transaction failed:", error);
      transaction.error = error instanceof Error ? error.message : String(error);
    }

    return transaction;
  };

  const sendZrc20Token = async (formData: z.infer<typeof FormSchema>) => {
    const mnemonicPhrases = await getMnemonicPhrases(accountAddress);
    return await signAndSendZrc20Token(
      accountAddress,
      formData.receiverAddress,
      formData.amount,
      mnemonicPhrases,
      tokenContractAddress,
      tokenDecimals,
    );
  };

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    try {
      let transactionData;
      if (isZrc20Token) {
        transactionData = await sendZrc20Token(formData);
      } else {
        transactionData = await sendNativeToken(formData);
      }
      const { transactionReceipt, error } = transactionData;

      if (error) {
        control.setError("amount", {
          message: `An error occured. ${error}`,
        });
      } else {
        const isTransactionSuccessful =
          transactionReceipt?.status.toString() === "1";
        if (isTransactionSuccessful) {
          await resetForm();
          setTransactionReceipt(transactionReceipt);
          await fetchAccounts();
          window.scrollTo(0, 0);
        } else {
          control.setError("amount", {
            message: `Transaction failed.`,
          });
        }
      }
    } catch (error) {
      control.setError("amount", {
        message: `An error occured. ${error}`,
      });
    }
  }

  const resetForm = async () => {
    await StorageUtil.clearTransactionValues();
    reset({ receiverAddress: "", amount: 0 });
  };

  const cancelTransaction = () => {
    resetForm();
    navigate(ROUTES.HOME);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: async () => {
      const storedTransactionValues = await StorageUtil.getTransactionValues();
      return {
        amount: storedTransactionValues?.amount ?? 0,
        receiverAddress: storedTransactionValues?.receiverAddress ?? "",
      };
    },
  });
  const {
    reset,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, isValid },
  } = form;

  useEffect(() => {
    (async () => {
      const shouldStartFresh = state?.shouldStartFresh;
      if (shouldStartFresh) {
        await resetForm();
      } else {
        const storedTransactionValues =
          await StorageUtil.getTransactionValues();
        const tokenDetailsFromStorage = storedTransactionValues?.tokenDetails;
        const tokenDetailsFromState = state?.tokenDetails;
        let tokenDetails = {
          isZrc20Token,
          tokenContractAddress,
          tokenDecimals,
          tokenImage,
          tokenBalance,
          tokenName,
          tokenSymbol,
        };

        if (tokenDetailsFromState) {
          await resetForm();
          setIsZrc20Token(tokenDetailsFromState?.isZrc20Token);
          setTokenContractAddress(tokenDetailsFromState?.tokenContractAddress);
          setTokenDecimals(tokenDetailsFromState?.tokenDecimals);
          setTokenImage(tokenDetailsFromState?.tokenImage);
          setTokenBalance(tokenDetailsFromState?.tokenBalance);
          setTokenName(tokenDetailsFromState?.tokenName);
          setTokenSymbol(tokenDetailsFromState?.tokenSymbol);
          tokenDetails = { ...tokenDetailsFromState };
        } else if (tokenDetailsFromStorage) {
          setIsZrc20Token(tokenDetailsFromStorage?.isZrc20Token ?? false);
          setTokenContractAddress(
            tokenDetailsFromStorage?.tokenContractAddress,
          );
          setTokenDecimals(tokenDetailsFromStorage?.tokenDecimals);
          setTokenImage(tokenDetailsFromStorage?.tokenImage);
          setTokenBalance(tokenDetailsFromStorage?.tokenBalance);
          setTokenName(tokenDetailsFromStorage?.tokenName);
          setTokenSymbol(tokenDetailsFromStorage?.tokenSymbol);
          tokenDetails = { ...tokenDetailsFromStorage };
        }

        await StorageUtil.setTransactionValues({
          amount: watch().amount,
          receiverAddress: watch().receiverAddress,
          tokenDetails,
        });
      }
    })();
  }, []);

  useEffect(() => {
    const formWatchSubscription = watch(async (value) => {
      await StorageUtil.setTransactionValues({
        ...value,
        tokenDetails: {
          isZrc20Token,
          tokenContractAddress,
          tokenDecimals,
          tokenImage,
          tokenBalance,
          tokenName,
          tokenSymbol,
        },
      });
    });
    return () => formWatchSubscription.unsubscribe();
  }, [
    watch,
    isZrc20Token,
    tokenContractAddress,
    tokenDecimals,
    tokenImage,
    tokenBalance,
    tokenName,
    tokenSymbol,
  ]);

  return transactionReceipt ? (
    <TransactionSuccessful transactionReceipt={transactionReceipt} />
  ) : (
    <Form {...form}>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <CircuitBackground />
        <div className="relative z-10 p-8">
          <BackButton />
          <Card className="w-full">
            <CardHeader className="flex flex-col gap-4 pb-4">
              <TokenDisplaySection
                tokenImage={tokenImage}
                tokenName={tokenName}
                tokenSymbol={tokenSymbol}
              />
            </CardHeader>
            <CardContent className="flex flex-col gap-8 pt-6">
              <div className="flex flex-col gap-1">
                <Label className="text-lg">Active account</Label>
                <AccountAddressSection tokenBalance={tokenBalance} />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-lg">Make a transaction</Label>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={control}
                    name="receiverAddress"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Send to</Label>
                        <FormControl>
                          <Input
                            {...field}
                            aria-label={field.name}
                            autoComplete="off"
                            disabled={isSubmitting}
                            placeholder="Receiver address"
                          />
                        </FormControl>
                        <FormDescription>
                          Receiver&apos;s public address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-start gap-4">
                    <FormField
                      control={control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Amount</Label>
                          <FormControl>
                            <Input
                              {...field}
                              aria-label={field.name}
                              autoComplete="off"
                              disabled={isSubmitting}
                              placeholder="Amount"
                              type="number"
                              step="any"
                            />
                          </FormControl>
                          <FormDescription>Amount to send</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-8 pt-8 text-lg">{tokenSymbol}</div>
                  </div>
                  <GasFeeNotice
                    isZrc20Token={isZrc20Token}
                    tokenContractAddress={tokenContractAddress}
                    tokenDecimals={tokenDecimals}
                    from={accountAddress}
                    to={watch().receiverAddress}
                    value={watch().amount}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-4">
              <Button
                className="w-full"
                type="button"
                variant="outline"
                onClick={() => cancelTransaction()}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button disabled={isSubmitting || !isValid} className="w-full">
                {isSubmitting ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isSubmitting
                  ? `Sending ${tokenSymbol}`
                  : `Send ${tokenSymbol}`}
              </Button>
            </CardFooter>
          </Card>
          <AlertDialog open={isSubmitting}>
            <AlertDialogContent className="w-80 rounded-md">
              <AlertDialogHeader className="text-left">
                <AlertDialogTitle>
                  <div className="flex items-center gap-2">
                    <Loader
                      className="animate-spin text-foreground"
                      size="18"
                    />
                    Transaction running
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Please wait while the transaction completes.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  );
});

export default TokenTransfer;

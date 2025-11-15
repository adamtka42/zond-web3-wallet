import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { ROUTES } from "@/router/router";
import { checkWalletAddZondChainParams } from "@/scripts/utils/restrictedMethodsMiddlewareUtils";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Pencil, Plus, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import UrlSelections from "./UrlSelections/UrlSelections";
import ChainIcon from "../../../ChainIcon/ChainIcon";

type AddEditChainFormType = {
  chainToEdit?: BlockchainDataType;
};

const FormSchema = z.object({
  chainName: z.string().min(1, "Chain name is required"),
  chainId: z.coerce.number().gt(0, "Chain ID should be positive"),
  currencyName: z.string().min(1, "Currency name is required"),
  currencySymbol: z.string().min(1, "Currency symbol is required"),
  currencyDecimals: z.coerce.number().gt(0, "Decimals should be positive"),
});

const AddEditChainForm = observer(({ chainToEdit }: AddEditChainFormType) => {
  const navigate = useNavigate();
  const { zondStore } = useStore();
  const { initializeBlockchain, addChain, editChain } = zondStore;

  const [rpcUrls, setRpcUrls] = useState<string[]>([]);
  const [defaultRpcUrl, setDefaultRpcUrl] = useState("");
  const [blockExplorerUrls, setBlockExplorerUrls] = useState<string[]>([]);
  const [defaultBlockExplorerUrl, setDefaultBlockExplorerUrl] = useState("");
  const [iconUrls, setIconUrls] = useState<string[]>([]);
  const [defaultIconUrl, setDefaultIconUrl] = useState("");
  const [error, setError] = useState("");

  const isChainEdit = !!chainToEdit;
  const labelText = isChainEdit ? "Edit chain" : "Add chain";
  const buttonSubmittingText = isChainEdit ? "Editing chain" : "Adding chain";
  const isCustomChain = chainToEdit?.isCustomChain ?? true;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      chainName: "",
      chainId: undefined,
      currencyName: "",
      currencySymbol: "",
      currencyDecimals: undefined,
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = form;

  useEffect(() => {
    if (isChainEdit) {
      form.reset({
        chainName: chainToEdit.chainName,
        chainId: parseInt(chainToEdit.chainId, 16),
        currencyName: chainToEdit.nativeCurrency.name,
        currencySymbol: chainToEdit.nativeCurrency.symbol,
        currencyDecimals: chainToEdit.nativeCurrency.decimals,
      });
      setRpcUrls(chainToEdit.rpcUrls);
      setDefaultRpcUrl(chainToEdit.defaultRpcUrl);
      setBlockExplorerUrls(chainToEdit.blockExplorerUrls);
      setDefaultBlockExplorerUrl(chainToEdit.defaultBlockExplorerUrl);
      setIconUrls(chainToEdit.iconUrls);
      setDefaultIconUrl(chainToEdit.defaultIconUrl);
    }
  }, [isChainEdit, chainToEdit, form]);

  useEffect(() => {
    const firstItem = rpcUrls.at(0) ?? "";
    setDefaultRpcUrl(
      rpcUrls.find((urlItem) => urlItem === defaultRpcUrl) ?? firstItem,
    );
  }, [rpcUrls]);

  useEffect(() => {
    const firstItem = blockExplorerUrls.at(0) ?? "";
    setDefaultBlockExplorerUrl(
      blockExplorerUrls.find(
        (urlItem) => urlItem === defaultBlockExplorerUrl,
      ) ?? firstItem,
    );
  }, [blockExplorerUrls]);

  useEffect(() => {
    const firstItem = iconUrls.at(0) ?? "";
    setDefaultIconUrl(
      iconUrls.find((urlItem) => urlItem === defaultIconUrl) ?? firstItem,
    );
  }, [iconUrls]);

  const generateBlockchainData = (formData: z.infer<typeof FormSchema>) => {
    const chainData: BlockchainDataType = {
      chainName: formData.chainName,
      chainId: "0x".concat(formData.chainId.toString(16)),
      nativeCurrency: {
        name: formData.currencyName,
        symbol: formData.currencySymbol,
        decimals: formData.currencyDecimals,
      },
      rpcUrls,
      blockExplorerUrls,
      iconUrls,
      defaultRpcUrl,
      defaultBlockExplorerUrl,
      defaultIconUrl,
      isTestnet: false,
      defaultWsRpcUrl: "http://127.0.0.1:8545",
      isCustomChain: true,
    };
    return chainData;
  };

  const addBlockchain = async (blockchainData: BlockchainDataType) => {
    const { chainFound, updatedChainList } = await addChain(blockchainData);
    if (chainFound) {
      setError(
        `A blockchain with the chain ID ${blockchainData.chainId} already exist.`,
      );
      return;
    }
    await StorageUtil.setAllBlockChains(updatedChainList);
    navigate(ROUTES.CHAIN_CONNECTIVITY);
  };

  const editBlockchain = async (blockchainData: BlockchainDataType) => {
    const { updatedChainList } = await editChain(blockchainData);
    await StorageUtil.setAllBlockChains(updatedChainList);
    navigate(ROUTES.CHAIN_CONNECTIVITY);
    await initializeBlockchain();
  };

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    setError("");
    const blockchainData = generateBlockchainData(formData);
    const { canProceed, proceedError } = await checkWalletAddZondChainParams(
      blockchainData,
      true,
    );
    if (!canProceed) {
      setError(proceedError?.message ?? "Form validation failed");
      return;
    }
    if (isChainEdit) {
      await editBlockchain(blockchainData);
    } else {
      await addBlockchain(blockchainData);
    }
  }

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="flex-row items-end justify-between">
            <CardTitle>{labelText}</CardTitle>
            <ChainIcon
              src={defaultIconUrl}
              alt={chainToEdit?.chainName ?? ""}
            />
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={control}
              name="chainName"
              render={({ field }) => (
                <FormItem>
                  <Label>Chain name</Label>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label={field.name}
                      autoComplete="off"
                      disabled={isSubmitting}
                      placeholder="Zond customnet"
                      type="text"
                    />
                  </FormControl>
                  <FormDescription>Blockchain name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="chainId"
              render={({ field }) => (
                <FormItem>
                  <Label>Chain ID</Label>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label={field.name}
                      autoComplete="off"
                      disabled={isSubmitting || isChainEdit}
                      placeholder="111"
                      type="number"
                    />
                  </FormControl>
                  <FormDescription>Unique chain ID</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <UrlSelections
              title="RPC URLs"
              canBeEmpty={false}
              urls={rpcUrls}
              setUrls={setRpcUrls}
              defaultUrl={defaultRpcUrl}
              setDefaultUrl={setDefaultRpcUrl}
            />
            <UrlSelections
              title="Block Explorer URLs"
              canBeEmpty={true}
              urls={blockExplorerUrls}
              setUrls={setBlockExplorerUrls}
              defaultUrl={defaultBlockExplorerUrl}
              setDefaultUrl={setDefaultBlockExplorerUrl}
            />
            <UrlSelections
              title="Icon URLs"
              canBeEmpty={true}
              urls={iconUrls}
              setUrls={setIconUrls}
              defaultUrl={defaultIconUrl}
              setDefaultUrl={setDefaultIconUrl}
            />
            <FormField
              control={control}
              name="currencyName"
              render={({ field }) => (
                <FormItem>
                  <Label>Currency name</Label>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label={field.name}
                      autoComplete="off"
                      disabled={isSubmitting || !isCustomChain}
                      placeholder="ZND"
                      type="text"
                    />
                  </FormControl>
                  <FormDescription>Currency of this blockchain</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={control}
                name="currencySymbol"
                render={({ field }) => (
                  <FormItem>
                    <Label>Symbol</Label>
                    <FormControl>
                      <Input
                        {...field}
                        aria-label={field.name}
                        autoComplete="off"
                        disabled={isSubmitting || !isCustomChain}
                        placeholder="ZND"
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>Currency symbol</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="currencyDecimals"
                render={({ field }) => (
                  <FormItem>
                    <Label>Decimals</Label>
                    <FormControl>
                      <Input
                        {...field}
                        aria-label={field.name}
                        autoComplete="off"
                        disabled={isSubmitting || !isCustomChain}
                        placeholder="18"
                        type="number"
                      />
                    </FormControl>
                    <FormDescription>Currency decimals</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && (
              <div className="text-sm font-bold text-destructive">{error}</div>
            )}
          </CardContent>
          <CardFooter className="gap-4">
            <Button
              className="w-full"
              type="button"
              variant="outline"
              onClick={() => {
                navigate(ROUTES.CHAIN_CONNECTIVITY);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              disabled={isSubmitting || !isValid}
              className="w-full"
              type="submit"
              aria-label="Add/edit chain"
            >
              {isSubmitting ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : isChainEdit ? (
                <Pencil className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? buttonSubmittingText : labelText}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
});

export default AddEditChainForm;

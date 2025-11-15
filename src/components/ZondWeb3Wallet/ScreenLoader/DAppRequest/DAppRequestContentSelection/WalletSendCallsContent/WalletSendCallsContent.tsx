import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardFooter } from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { Check, Info, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import WalletSendCallsInfo from "./WalletSendCallsInfo/WalletSendCallsInfo";

const WalletSendCallsContent = observer(() => {
  const { dAppRequestStore } = useStore();
  const {
    dAppRequestData,
    onPermission,
    approvalProcessingStatus,
    setOnPermissionCallBack,
    addToResponseData,
  } = dAppRequestStore;
  const { isProcessing } = approvalProcessingStatus;

  const addBlockchain = async () => {
    const onPermissionCallBack = async (hasApproved: boolean) => {
      if (hasApproved) {
        // TODO: add the transactions to the smart contract
        dAppRequestData;
        addToResponseData({ batchId: "0xSamppleBatchId" });
      }
    };
    setOnPermissionCallBack(onPermissionCallBack);
    await onPermission(true);
  };

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="mb-1 text-xs font-bold">Add transactions</div>
        <div>
          Here is a request to add the following transactions to the blockchain.
        </div>
      </div>
      <CardContent className="space-y-6">
        <WalletSendCallsInfo />
        <Alert className="mt-2">
          <Info className="h-4 w-4" />
          <AlertTitle>Using Smart Account</AlertTitle>
          <AlertDescription className="text-xs">
            This transaction will be delegated to a smart contract. You may
            check the status of the transaction using the wallet_getCallsStatus
            call.
          </AlertDescription>
        </Alert>
        <div className="font-bold">
          Do you want to add transactions to chain?
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4">
        <Button
          className="w-full"
          variant="outline"
          type="button"
          disabled={isProcessing}
          aria-label="No"
          onClick={() => onPermission(false)}
        >
          <X className="mr-2 h-4 w-4" />
          No
        </Button>
        <Button
          className="w-full"
          type="button"
          disabled={isProcessing}
          aria-label="Yes"
          onClick={() => addBlockchain()}
        >
          <Check className="mr-2 h-4 w-4" />
          Yes
        </Button>
      </CardFooter>
    </Card>
  );
});

export default WalletSendCallsContent;

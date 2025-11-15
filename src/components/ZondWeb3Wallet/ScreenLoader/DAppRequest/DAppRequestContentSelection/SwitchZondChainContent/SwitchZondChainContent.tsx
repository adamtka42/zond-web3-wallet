import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardFooter } from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { Check, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import SwitchZondChainInfo from "./SwitchZondChainInfo/SwitchZondChainInfo";
import { includeChainForUrlOrigin } from "@/scripts/utils/restrictedMethodsMiddlewareUtils";

const SwitchZondChainContent = observer(() => {
  const { dAppRequestStore, zondStore } = useStore();
  const { selectBlockchain } = zondStore;
  const {
    dAppRequestData,
    onPermission,
    approvalProcessingStatus,
    setOnPermissionCallBack,
    addToResponseData,
  } = dAppRequestStore;
  const { isProcessing } = approvalProcessingStatus;

  const paramObject = dAppRequestData?.params?.[0];
  const chainId = paramObject?.chainId;

  const switchChain = async () => {
    const onPermissionCallBack = async (hasApproved: boolean) => {
      if (hasApproved) {
        await includeChainForUrlOrigin({
          urlOrigin: dAppRequestData?.requestData?.senderData?.url ?? "",
          chainId,
        });
        await selectBlockchain(chainId);
        addToResponseData({ result: true });
      }
    };
    setOnPermissionCallBack(onPermissionCallBack);
    await onPermission(true);
  };

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="mb-1 text-xs font-bold">Switch chain</div>
        <div>Here is a request to switch the current blockchain.</div>
      </div>
      <CardContent className="space-y-6">
        <SwitchZondChainInfo />
        <div className="font-bold">Do you want to switch the chain?</div>
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
          onClick={() => switchChain()}
        >
          <Check className="mr-2 h-4 w-4" />
          Yes
        </Button>
      </CardFooter>
    </Card>
  );
});

export default SwitchZondChainContent;

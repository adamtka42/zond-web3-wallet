import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/UI/AlertDialog";
import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardFooter } from "@/components/UI/Card";
import ChainBadge from "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/ChainBadge/ChainBadge";
import { useStore } from "@/stores/store";
import { Check, Loader, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import DAppRequestWebsite from "./DAppRequestWebsite/DAppRequestWebsite";

const PermissionRequiredContent = observer(() => {
  const { dAppRequestStore } = useStore();
  const { onPermission, canProceed, approvalProcessingStatus } =
    dAppRequestStore;
  const { isProcessing, hasApproved } = approvalProcessingStatus;
  const isRejectionProcessing = isProcessing && !hasApproved;
  const isApprovalProcessing = isProcessing && hasApproved;

  return (
    <>
      <Card className="w-full">
        <div className="flex justify-center pt-6">
          <ChainBadge isDisabled={true} />
        </div>
        <div className="p-6">
          <div className="mb-1 text-xs font-bold">Your permission required</div>
          <div>
            Here is a request coming in. Go through the details and decide if it
            needs to be allowed.
          </div>
        </div>
        <CardContent className="space-y-6">
          <DAppRequestWebsite />
          <div className="font-bold">Do you trust and want to allow this?</div>
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
            {isRejectionProcessing ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-2 h-4 w-4" />
            )}
            No
          </Button>
          <Button
            className="w-full"
            type="button"
            disabled={!canProceed || isProcessing}
            aria-label="Yes"
            onClick={() => onPermission(true)}
          >
            {isApprovalProcessing ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Yes
          </Button>
        </CardFooter>
      </Card>
      <AlertDialog open={isProcessing}>
        <AlertDialogContent className="w-80 rounded-md">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>
              <div className="flex items-center gap-2">
                <Loader className="animate-spin text-foreground" size="18" />
                Transaction running
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please wait. This may take a while.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

export default PermissionRequiredContent;

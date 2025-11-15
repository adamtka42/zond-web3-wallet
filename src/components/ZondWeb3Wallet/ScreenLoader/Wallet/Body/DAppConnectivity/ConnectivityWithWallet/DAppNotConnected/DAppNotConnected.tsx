import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import { Unlink } from "lucide-react";

const DAppNotConnected = () => {
  return (
    <Alert>
      <Unlink className="h-4 w-4" data-testid="unlink-icon" />
      <AlertTitle>Not Connected</AlertTitle>
      <AlertDescription>
        Zond Web3 Wallet is not connected with this website.
      </AlertDescription>
    </Alert>
  );
};

export default DAppNotConnected;

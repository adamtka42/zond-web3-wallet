import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import { ShieldAlert } from "lucide-react";

const AddZondChainAlert = () => {
  return (
    <Alert className="mt-2">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Careful!</AlertTitle>
      <AlertDescription className="text-xs">
        Before adding the blockchain and making transactions, make sure you
        understand what you are doing.
      </AlertDescription>
    </Alert>
  );
};

export default AddZondChainAlert;

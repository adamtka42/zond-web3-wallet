import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import { ShieldAlert } from "lucide-react";
import { observer } from "mobx-react-lite";
import ZondRequestAccountContent from "./ZondRequestAccountContent/ZondRequestAccountContent";

const ZondRequestAccount = observer(() => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-bold">Connect with Wallet</div>
      <ZondRequestAccountContent />
      <Alert className="mt-2">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Careful!</AlertTitle>
        <AlertDescription className="text-xs">
          There are token approval scams out there. Ensure you only connect your
          wallet with the websites you trust.
        </AlertDescription>
      </Alert>
    </div>
  );
});

export default ZondRequestAccount;

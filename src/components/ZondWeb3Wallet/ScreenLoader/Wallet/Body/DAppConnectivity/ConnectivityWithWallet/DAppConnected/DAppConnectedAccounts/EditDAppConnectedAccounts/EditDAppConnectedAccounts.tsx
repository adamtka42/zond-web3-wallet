import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import ZondRequestAccountAccountSelection from "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/PermissionRequiredContent/DAppRequestWebsite/DAppRequestFeature/ZondRequestAccount/ZondRequestAccountContent/ZondRequestAccountAccountSelection/ZondRequestAccountAccountSelection";
import BackButton from "@/components/ZondWeb3Wallet/ScreenLoader/Shared/BackButton/BackButton";
import CircuitBackground from "@/components/ZondWeb3Wallet/ScreenLoader/Shared/CircuitBackground/CircuitBackground";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import { Pencil, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ActiveBrowserTabIcon from "../../../../ActiveBrowserTab/ActiveBrowserTabIcon/ActiveBrowserTabIcon";
import { updateAccountsAndBlockchainsForUrlOrigin } from "@/scripts/utils/restrictedMethodsMiddlewareUtils";

const EditDAppConnectedAccounts = observer(() => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { dAppRequestStore } = useStore();
  const { currentTabData } = dAppRequestStore;
  const hasState = !!state?.hasState;

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    currentTabData?.connectedAccounts ?? [],
  );

  useEffect(() => {
    if (!hasState) {
      navigate(ROUTES.DAPP_CONNECTIVITY);
    }
  }, [hasState]);

  const onAccountSelection = (selectedAccount: string, checked: boolean) => {
    let updatedAccounts = selectedAccounts;
    if (checked) {
      updatedAccounts = Array.from(
        new Set([...updatedAccounts, selectedAccount]),
      );
    } else {
      updatedAccounts = updatedAccounts.filter(
        (account) => account !== selectedAccount,
      );
    }
    setSelectedAccounts(updatedAccounts);
  };

  const onEdit = async () => {
    await updateAccountsAndBlockchainsForUrlOrigin({
      urlOrigin: currentTabData?.urlOrigin ?? "",
      accounts: selectedAccounts,
      blockchains: currentTabData?.connectedBlockchains ?? [],
    });
    navigate(ROUTES.DAPP_CONNECTIVITY);
  };

  return (
    <>
      <CircuitBackground />
      <div className="relative z-10 p-8">
        <BackButton />
        <Card>
          <CardHeader className="flex-row justify-between">
            <CardTitle>Edit connected accounts</CardTitle>
            <ActiveBrowserTabIcon
              favIconUrl={currentTabData?.favIconUrl}
              altText={currentTabData?.title}
            />
          </CardHeader>
          <CardContent className="space-y-8">
            <ZondRequestAccountAccountSelection
              selectedAccounts={selectedAccounts}
              onAccountSelection={onAccountSelection}
            />
          </CardContent>
          <CardFooter className="gap-4">
            <Button
              className="w-full"
              type="button"
              variant="outline"
              aria-label="Cancel"
              onClick={() => {
                navigate(ROUTES.DAPP_CONNECTIVITY);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              className="w-full"
              disabled={!selectedAccounts.length}
              type="submit"
              aria-label="Edit accounts"
              onClick={onEdit}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
});

export default EditDAppConnectedAccounts;

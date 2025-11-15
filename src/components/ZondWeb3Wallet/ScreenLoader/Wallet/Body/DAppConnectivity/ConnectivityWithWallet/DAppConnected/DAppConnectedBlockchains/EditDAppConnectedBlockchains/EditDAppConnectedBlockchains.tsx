import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import ZondRequestAccountBlockchainSelection from "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/PermissionRequiredContent/DAppRequestWebsite/DAppRequestFeature/ZondRequestAccount/ZondRequestAccountContent/ZondRequestAccountBlockchainSelection/ZondRequestAccountBlockchainSelection";
import BackButton from "@/components/ZondWeb3Wallet/ScreenLoader/Shared/BackButton/BackButton";
import CircuitBackground from "@/components/ZondWeb3Wallet/ScreenLoader/Shared/CircuitBackground/CircuitBackground";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { Pencil, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ActiveBrowserTabIcon from "../../../../ActiveBrowserTab/ActiveBrowserTabIcon/ActiveBrowserTabIcon";
import { updateAccountsAndBlockchainsForUrlOrigin } from "@/scripts/utils/restrictedMethodsMiddlewareUtils";

const EditDAppConnectedBlockchains = observer(() => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { dAppRequestStore, zondStore } = useStore();
  const { initializeBlockchain } = zondStore;
  const { currentTabData } = dAppRequestStore;
  const hasState = !!state?.hasState;

  const [isLoadingBlockchains, setIsLoadingBlockchains] = useState(true);
  const [allBlockchains, setAllBlockchains] = useState<BlockchainDataType[]>(
    [],
  );
  const [selectedBlockchains, setSelectedBlockchains] = useState<
    BlockchainDataType[]
  >(currentTabData?.connectedBlockchains ?? []);

  useEffect(() => {
    (async () => {
      const allBlockchains = await StorageUtil.getAllBlockChains();
      setAllBlockchains(allBlockchains);
      setIsLoadingBlockchains(false);
    })();
  }, []);

  useEffect(() => {
    if (!hasState) {
      navigate(ROUTES.DAPP_CONNECTIVITY);
    }
  }, [hasState]);

  const onBlockchainSelection = (
    selectedBlockchain: BlockchainDataType,
    checked: boolean,
  ) => {
    let updatedBlockchains = selectedBlockchains;
    if (checked) {
      updatedBlockchains = Array.from(
        new Set([...updatedBlockchains, selectedBlockchain]),
      );
    } else {
      updatedBlockchains = updatedBlockchains.filter(
        (blockchain) => blockchain.chainId !== selectedBlockchain.chainId,
      );
    }
    setSelectedBlockchains(updatedBlockchains);
  };

  const onEdit = async () => {
    await updateAccountsAndBlockchainsForUrlOrigin({
      urlOrigin: currentTabData?.urlOrigin ?? "",
      accounts: currentTabData?.connectedAccounts ?? [],
      blockchains: selectedBlockchains,
    });
    navigate(ROUTES.DAPP_CONNECTIVITY);
    initializeBlockchain();
  };

  return (
    <>
      <CircuitBackground />
      <div className="relative z-10 p-8">
        <BackButton />
        <Card>
          <CardHeader className="flex-row justify-between">
            <CardTitle>Edit connected blockchains</CardTitle>
            <ActiveBrowserTabIcon
              favIconUrl={currentTabData?.favIconUrl}
              altText={currentTabData?.title}
            />
          </CardHeader>
          <CardContent className="space-y-8">
            <ZondRequestAccountBlockchainSelection
              isLoading={isLoadingBlockchains}
              allBlockchains={allBlockchains}
              selectedBlockchains={selectedBlockchains}
              onBlockchainSelection={onBlockchainSelection}
            />
          </CardContent>
          <CardFooter className="gap-4">
            <Button
              className="w-full"
              type="button"
              variant="outline"
              onClick={() => {
                navigate(ROUTES.DAPP_CONNECTIVITY);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              className="w-full"
              disabled={!selectedBlockchains.length}
              type="submit"
              aria-label="Edit blockchains"
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

export default EditDAppConnectedBlockchains;

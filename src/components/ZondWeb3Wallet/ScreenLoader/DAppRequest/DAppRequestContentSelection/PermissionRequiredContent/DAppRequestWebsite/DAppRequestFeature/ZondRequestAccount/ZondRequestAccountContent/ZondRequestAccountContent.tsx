import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ZondRequestAccountAccountSelection from "./ZondRequestAccountAccountSelection/ZondRequestAccountAccountSelection";
import ZondRequestAccountBlockchainSelection from "./ZondRequestAccountBlockchainSelection/ZondRequestAccountBlockchainSelection";
import StorageUtil from "@/utilities/storageUtil";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";

const ZondRequestAccountContent = observer(() => {
  const { dAppRequestStore } = useStore();
  const { addToResponseData, setCanProceed, currentTabData } = dAppRequestStore;

  const [isLoadingBlockchains, setIsLoadingBlockchains] = useState(true);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [allBlockchains, setAllBlockchains] = useState<BlockchainDataType[]>(
    [],
  );
  const [selectedBlockchains, setSelectedBlockchains] = useState<
    BlockchainDataType[]
  >([]);

  useEffect(() => {
    (async () => {
      const allBlockchains = await StorageUtil.getAllBlockChains();
      setSelectedAccounts(currentTabData?.connectedAccounts ?? []);
      setAllBlockchains(allBlockchains);
      setSelectedBlockchains(currentTabData?.connectedBlockchains ?? []);
      setIsLoadingBlockchains(false);
    })();
  }, [currentTabData]);

  useEffect(() => {
    addToResponseData({
      accounts: selectedAccounts,
      blockchains: selectedBlockchains,
    });
    setCanProceed(!!selectedAccounts.length && !!selectedBlockchains.length);
  }, [selectedAccounts, selectedBlockchains]);

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

  return (
    <Tabs defaultValue="accounts">
      <TabsList className="w-full">
        <TabsTrigger
          value="accounts"
          className="w-full data-[state=active]:text-secondary"
        >
          Accounts
        </TabsTrigger>
        <TabsTrigger
          value="blockchains"
          className="w-full data-[state=active]:text-secondary"
        >
          Blockchains
        </TabsTrigger>
      </TabsList>
      <TabsContent value="accounts" className="rounded-md p-2">
        <ZondRequestAccountAccountSelection
          selectedAccounts={selectedAccounts}
          onAccountSelection={onAccountSelection}
        />
      </TabsContent>
      <TabsContent value="blockchains" className="rounded-md p-2">
        <ZondRequestAccountBlockchainSelection
          isLoading={isLoadingBlockchains}
          allBlockchains={allBlockchains}
          selectedBlockchains={selectedBlockchains}
          onBlockchainSelection={onBlockchainSelection}
        />
      </TabsContent>
    </Tabs>
  );
});

export default ZondRequestAccountContent;

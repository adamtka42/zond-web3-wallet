import { Card } from "@/components/UI/Card";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { useEffect, useState } from "react";
import ChainInfoCard from "./ChainInfoCard/ChainInfoCard";
import { ArrowDown } from "lucide-react";

const SwitchZondChainInfo = () => {
  const { dAppRequestStore } = useStore();
  const { dAppRequestData } = dAppRequestStore;
  const paramObject = dAppRequestData?.params?.[0];

  const [currentChain, setCurrentChain] = useState<
    BlockchainDataType | undefined
  >();
  const [switchingChain, setSwitchingChain] = useState<
    BlockchainDataType | undefined
  >();

  useEffect(() => {
    (async () => {
      const currentChainId = (await StorageUtil.getActiveBlockChain())?.chainId;
      const switchingChainId = paramObject?.chainId;
      const allBlockchains = await StorageUtil.getAllBlockChains();
      setCurrentChain(
        allBlockchains.find(
          (chain) =>
            chain.chainId.toLowerCase() === currentChainId?.toLowerCase(),
        ),
      );
      setSwitchingChain(
        allBlockchains.find(
          (chain) =>
            chain.chainId.toLowerCase() === switchingChainId?.toLowerCase(),
        ),
      );
    })();
  }, []);

  if (!currentChain || !switchingChain)
    return (
      <div className="flex h-12 w-full animate-pulse items-center justify-between">
        <div className="h-full w-full rounded-md bg-accent" />
      </div>
    );

  return (
    <Card className="flex flex-col gap-4 p-4">
      <ChainInfoCard
        title="Current chain"
        description="The currently active blockchain of the wallet"
        chain={currentChain}
      />
      <div className="flex justify-center">
        <ArrowDown data-testid="arrow-down-icon" />
      </div>
      <ChainInfoCard
        title="Switching to"
        description="The blockchain to which the wallet will be switched to"
        chain={switchingChain}
      />
    </Card>
  );
};

export default SwitchZondChainInfo;

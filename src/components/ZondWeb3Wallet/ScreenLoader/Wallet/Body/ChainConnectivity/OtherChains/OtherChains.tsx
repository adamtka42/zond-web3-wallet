import { Label } from "@/components/UI/Label";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import OtherChainItem from "./OtherChainItem/OtherChainItem";

const OtherChains = observer(() => {
  const { zondStore } = useStore();
  const { zondConnection } = zondStore;
  const { blockchain } = zondConnection;
  const { chainId } = blockchain;

  const [reRender, setReRender] = useState(0);
  const [otherChains, setOtherChains] = useState<BlockchainDataType[]>([]);

  useEffect(() => {
    (async () => {
      const blockchains = await StorageUtil.getAllBlockChains();
      setOtherChains(blockchains.filter((chain) => chain.chainId !== chainId));
    })();
  }, [reRender]);

  const triggerReRender = () => {
    setReRender(reRender + 1);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">Other chains</Label>
      {otherChains.map((blockchain) => {
        return (
          <OtherChainItem
            blockchain={blockchain}
            triggerReRender={triggerReRender}
          />
        );
      })}
    </div>
  );
});

export default OtherChains;

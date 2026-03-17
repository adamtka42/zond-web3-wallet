import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ZRC20Token from "./ZRC20Token/ZRC20Token";
import { ZRC_20_ITEMS_DISPLAY_LIMIT } from "@/constants/zrc20Token";
import { TokenContractType } from "@/scripts/middlewares/middlewareTypes";

type ZRC20TokensProps = {
  shouldDisplayAllTokens?: boolean;
};

const ZRC20Tokens = observer(
  ({ shouldDisplayAllTokens = false }: ZRC20TokensProps) => {
    const { qrlStore } = useStore();
    const { activeAccount, qrlConnection } = qrlStore;
    const { accountAddress } = activeAccount;
    const { blockchain } = qrlConnection;

    const [reRender, setReRender] = useState(0);
    const [tokenContractsList, setTokenContractsList] = useState<
      TokenContractType[]
    >([]);

    const numberOfTokens = tokenContractsList.length;
    const displayLimit = shouldDisplayAllTokens
      ? numberOfTokens + 1
      : ZRC_20_ITEMS_DISPLAY_LIMIT;

    useEffect(() => {
      (async () => {
        const storedTokens =
          await StorageUtil.getTokenContractsList(accountAddress);
        setTokenContractsList(storedTokens);
      })();
    }, [blockchain, accountAddress, reRender]);

    const triggerReRender = () => {
      setReRender(reRender + 1);
    };

    if (shouldDisplayAllTokens && !numberOfTokens) {
      return <div>There are no tokens.</div>;
    }

    return (
      <>
        {tokenContractsList.slice(0, displayLimit).map(({ address, image }) => (
          <ZRC20Token
            key={address}
            contractAddress={address}
            tokenImage={image}
            triggerReRender={triggerReRender}
          />
        ))}
      </>
    );
  },
);

export default ZRC20Tokens;

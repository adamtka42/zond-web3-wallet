import { BlockchainBaseDataType } from "@/configuration/zondBlockchainConfig";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import AddZondChainUrlList from "./AddZondChainUrlList/AddZondChainUrlList";
import CurrencyImagePreload from "./CurrencyImagePreload/CurrencyImagePreload";

const AddZondChainDetails = observer(() => {
  const { dAppRequestStore } = useStore();
  const { dAppRequestData } = dAppRequestStore;

  const blockchain = dAppRequestData?.params?.[0] as BlockchainBaseDataType;
  const currencyName = blockchain?.nativeCurrency?.name;
  const currencySymbol = blockchain?.nativeCurrency?.symbol;
  const currencyDecimal = blockchain?.nativeCurrency?.decimals;
  const chainName = blockchain?.chainName;
  const chainId = blockchain?.chainId;
  const rpcUrls = blockchain?.rpcUrls ?? [];
  const blockExplorerUrls = blockchain?.blockExplorerUrls ?? [];
  const iconUrls = blockchain?.iconUrls ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-1">
          <div>Chain name</div>
          <div className="font-bold text-secondary">{chainName}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>Chain ID</div>
          <div className="font-bold text-secondary">
            {parseInt(chainId, 16)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-1">
          <div>Symbol</div>
          <div className="font-bold text-secondary">{currencySymbol}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>Decimals</div>
          <div className="font-bold text-secondary">{currencyDecimal}</div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 transition-all duration-1000">
          <div>Currency name</div>
          <div className="font-bold text-secondary">{currencyName}</div>
        </div>
        <CurrencyImagePreload iconUrls={iconUrls} />
      </div>
      <AddZondChainUrlList title="RPC URLs" urlList={rpcUrls} />
      <AddZondChainUrlList
        title="Block Explorer URLs"
        urlList={blockExplorerUrls}
      />
      <AddZondChainUrlList title="Icon URLs" urlList={iconUrls} />
    </div>
  );
});

export default AddZondChainDetails;

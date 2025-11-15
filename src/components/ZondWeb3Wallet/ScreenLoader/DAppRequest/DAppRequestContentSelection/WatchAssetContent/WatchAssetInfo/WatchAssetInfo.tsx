import { Card } from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import StringUtil from "@/utilities/stringUtil";
import CurrencyImagePreload from "../../AddZondChainContent/AddZondChainInfo/AddZondChainDetails/CurrencyImagePreload/CurrencyImagePreload";

const WatchAssetInfo = () => {
  const { dAppRequestStore } = useStore();
  const { dAppRequestData } = dAppRequestStore;

  const paramsObject = dAppRequestData?.params[0];
  const asset = paramsObject?.options;

  const { prefix, addressSplit } = StringUtil.getSplitAddress(
    asset?.address ?? "",
  );

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div>Token address</div>
          <div className="flex flex-wrap gap-1 font-bold text-secondary">
            {`${prefix} ${addressSplit.join(" ")}`}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 transition-all duration-1000">
              <div>Symbol</div>
              <div className="font-bold text-secondary">{asset?.symbol}</div>
            </div>
            <CurrencyImagePreload iconUrls={[asset?.image ?? ""]} />
          </div>
          <div className="flex flex-col gap-1">
            <div>Decimals</div>
            <div className="font-bold text-secondary">{asset?.decimals}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WatchAssetInfo;

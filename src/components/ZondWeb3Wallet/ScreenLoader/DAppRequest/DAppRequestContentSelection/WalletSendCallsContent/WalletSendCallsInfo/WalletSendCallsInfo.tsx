import { Card } from "@/components/UI/Card";
import { Separator } from "@/components/UI/Separator";
import { useStore } from "@/stores/store";
import WalletSendCallsTransactions from "./WalletSendCallsTransactions/WalletSendCallsTransactions";
import { observer } from "mobx-react-lite";

const WalletSendCallsInfo = observer(() => {
  const { dAppRequestStore } = useStore();
  const { dAppRequestData } = dAppRequestStore;

  const paramsObject = dAppRequestData?.params[0];
  const { chainId, calls } = paramsObject;

  const parsedUrl = new URL(
    dAppRequestData?.requestData?.senderData?.url ?? "",
  );
  const urlOrigin = parsedUrl.origin;
  const numberOfTransactions = calls?.length ?? 0;

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <img
          className="h-6 w-6"
          src={dAppRequestData?.requestData?.senderData?.favIconUrl}
          alt={dAppRequestData?.requestData?.senderData?.title}
        />
        <div className="flex flex-col">
          <span className="font-bold">{urlOrigin}</span>
          <span className="text-xm opacity-80">
            {dAppRequestData?.requestData?.senderData?.title}
          </span>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-1">
          <div>No. of transactions</div>
          <div className="font-bold text-secondary">{numberOfTransactions}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>Chain ID</div>
          <div className="font-bold text-secondary">{chainId}</div>
        </div>
      </div>
      <WalletSendCallsTransactions />
    </Card>
  );
});

export default WalletSendCallsInfo;

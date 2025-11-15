import { Label } from "@/components/UI/Label";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import DAppConnected from "./DAppConnected/DAppConnected";
import DAppNotConnected from "./DAppNotConnected/DAppNotConnected";

const ConnectivityWithWallet = observer(() => {
  const { dAppRequestStore } = useStore();
  const { hasDAppConnected } = dAppRequestStore;

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">Connectivity with wallet</Label>
      {hasDAppConnected ? <DAppConnected /> : <DAppNotConnected />}
    </div>
  );
});

export default ConnectivityWithWallet;

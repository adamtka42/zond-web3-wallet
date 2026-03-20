import { Label } from "@/components/UI/Label";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import DAppConnected from "./DAppConnected/DAppConnected";
import DAppNotConnected from "./DAppNotConnected/DAppNotConnected";

const ConnectivityWithWallet = observer(() => {
  const { t } = useTranslation();
  const { dAppRequestStore } = useStore();
  const { hasDAppConnected } = dAppRequestStore;

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">{t('dapp.connectivityWithWallet')}</Label>
      {hasDAppConnected ? <DAppConnected /> : <DAppNotConnected />}
    </div>
  );
});

export default ConnectivityWithWallet;

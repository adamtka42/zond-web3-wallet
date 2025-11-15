import { RESTRICTED_METHODS } from "@/scripts/constants/requestConstants";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import AddZondChainContent from "./AddZondChainContent/AddZondChainContent";
import PermissionRequiredContent from "./PermissionRequiredContent/PermissionRequiredContent";
import SwitchZondChainContent from "./SwitchZondChainContent/SwitchZondChainContent";
import WatchAssetContent from "./WatchAssetContent/WatchAssetContent";
import WalletSendCallsContent from "./WalletSendCallsContent/WalletSendCallsContent";

const PERMISSION_REQUIRED_METHODS: string[] = [
  RESTRICTED_METHODS.PERSONAL_SIGN,
  RESTRICTED_METHODS.ZOND_REQUEST_ACCOUNTS,
  RESTRICTED_METHODS.WALLET_REQUEST_PERMISSIONS,
  RESTRICTED_METHODS.ZOND_SEND_TRANSACTION,
  RESTRICTED_METHODS.ZOND_SIGN_TYPED_DATA_V4,
];

const DAppRequestContentSelection = observer(() => {
  const { dAppRequestStore } = useStore();
  const { dAppRequestData } = dAppRequestStore;
  const method = dAppRequestData?.method ?? "";

  if (method === RESTRICTED_METHODS.WALLET_ADD_ZOND_CHAIN)
    return <AddZondChainContent />;

  if (method === RESTRICTED_METHODS.WALLET_SEND_CALLS)
    return <WalletSendCallsContent />;

  if (method === RESTRICTED_METHODS.WALLET_SWITCH_ZOND_CHAIN)
    return <SwitchZondChainContent />;

  if (method === RESTRICTED_METHODS.WALLET_WATCH_ASSET)
    return <WatchAssetContent />;

  if (PERMISSION_REQUIRED_METHODS.includes(method))
    return <PermissionRequiredContent />;
});

export default DAppRequestContentSelection;

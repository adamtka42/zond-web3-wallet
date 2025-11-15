import { useStore } from "@/stores/store";
import { Loader, WifiOff } from "lucide-react";
import { observer } from "mobx-react-lite";
import ChainIcon from "../../../Body/ChainConnectivity/ChainIcon/ChainIcon";

const ChainBadgeIcon = observer(() => {
  const { zondStore } = useStore();
  const { zondConnection } = zondStore;
  const { isLoading, isConnected, blockchain } = zondConnection;
  const { chainName, defaultIconUrl } = blockchain;

  if (isLoading)
    return (
      <Loader className="h-3 w-3 animate-spin" data-testid="loader-icon" />
    );
  if (!isConnected)
    return <WifiOff className="h-3 w-3" data-testid="wifi-off-icon" />;

  return (
    <ChainIcon src={defaultIconUrl} alt={chainName} chainIconSize="small" />
  );
});

export default ChainBadgeIcon;

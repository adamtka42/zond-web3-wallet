import { useStore } from "@/stores/store";
import { Unlink } from "lucide-react";
import { observer } from "mobx-react-lite";

const DAppBadgeIcon = observer(() => {
  const { dAppRequestStore } = useStore();
  const { hasDAppConnected, currentTabData } = dAppRequestStore;
  const favIconUrl = currentTabData?.favIconUrl;
  const favIconTitle = currentTabData?.title;

  return hasDAppConnected && favIconUrl ? (
    <img className="h-3 w-3" src={favIconUrl} alt={favIconTitle} />
  ) : (
    <Unlink className="h-3 w-3" data-testid="unlink-icon" />
  );
});

export default DAppBadgeIcon;

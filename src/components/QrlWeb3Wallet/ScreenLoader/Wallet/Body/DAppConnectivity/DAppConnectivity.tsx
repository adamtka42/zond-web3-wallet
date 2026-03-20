import { ROUTES } from "@/router/router";
import BackButton from "../../../Shared/BackButton/BackButton";
import ActiveBrowserTab from "./ActiveBrowserTab/ActiveBrowserTab";
import ConnectivityWithWallet from "./ConnectivityWithWallet/ConnectivityWithWallet";

const DAppConnectivity = () => {
  return (
    <div className="flex w-full flex-col gap-2 p-8">
      <BackButton navigationRoute={ROUTES.HOME} />
      <div className="flex flex-col gap-8">
        <ActiveBrowserTab />
        <ConnectivityWithWallet />
      </div>
    </div>
  );
};

export default DAppConnectivity;

import withSuspense from "@/functions/withSuspense";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { lazy, useEffect, useState } from "react";

const SCREENS = {
  LOCK: "LOCK",
  DAPP_REQUEST: "DAPP_REQUEST",
  WALLET: "WALLET",
};

const Lock = withSuspense(
  lazy(() => import("@/components/ZondWeb3Wallet/ScreenLoader/Lock/Lock")),
);
const DAppRequest = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequest"
      ),
  ),
);
const Wallet = withSuspense(
  lazy(() => import("@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Wallet")),
);

const ScreenLoader = observer(() => {
  const { dAppRequestStore, lockStore } = useStore();
  const { hasDAppRequest, readDAppRequestData } = dAppRequestStore;
  const { isLocked, readLockState } = lockStore;

  const [screen, setScreen] = useState(SCREENS.LOCK);

  useEffect(() => {
    (async () => {
      await readLockState();
      await readDAppRequestData();
    })();
  }, []);

  useEffect(() => {
    if (isLocked) {
      setScreen(SCREENS.LOCK);
    } else if (hasDAppRequest) {
      setScreen(SCREENS.DAPP_REQUEST);
    } else {
      setScreen(SCREENS.WALLET);
    }
  }, [isLocked, hasDAppRequest]);

  if (screen === SCREENS.LOCK) return <Lock />;

  if (screen === SCREENS.DAPP_REQUEST) return <DAppRequest />;

  if (screen === SCREENS.WALLET) return <Wallet />;
});

export default ScreenLoader;

import withSuspense from "@/functions/withSuspense";
import { useStore } from "@/stores/store";
import { cva } from "class-variance-authority";
import { observer } from "mobx-react-lite";
import { lazy } from "react";

const ZondWeb3WalletLogo = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/ZondWeb3WalletLogo/ZondWeb3WalletLogo"
      ),
  ),
);
const AccountBadge = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/AccountBadge/AccountBadge"
      ),
  ),
);
const DAppBadge = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/DAppBadge/DAppBadge"
      ),
  ),
);
const ChainBadge = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/ChainBadge/ChainBadge"
      ),
  ),
);
const ZondWeb3WalletMoreOptions = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/ZondWeb3WalletMoreOptions/ZondWeb3WalletMoreOptions"
      ),
  ),
);

const headerClasses = cva(
  "fixed z-20 flex h-16 items-center justify-between border-b-2 border-secondary bg-background px-4",
  {
    variants: {
      isPopupWindow: {
        true: ["w-[23rem]"],
        false: ["w-[22rem]"],
      },
    },
    defaultVariants: {
      isPopupWindow: true,
    },
  },
);

const Header = observer(() => {
  const { settingsStore } = useStore();
  const { isPopupWindow } = settingsStore;

  return (
    <div
      className={headerClasses({
        isPopupWindow,
      })}
    >
      <ZondWeb3WalletLogo />
      <div className="flex items-center gap-2">
        <AccountBadge />
        <DAppBadge />
        <ChainBadge displayChainName={false} />
        <ZondWeb3WalletMoreOptions />
      </div>
    </div>
  );
});

export default Header;

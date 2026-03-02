import withSuspense from "@/functions/withSuspense";
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

const Header = () => {
  return (
    <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b-2 border-secondary bg-background px-4">
      <ZondWeb3WalletLogo />
      <div className="flex items-center gap-2">
        <AccountBadge />
        <DAppBadge />
        <ChainBadge displayChainName={false} />
        <ZondWeb3WalletMoreOptions />
      </div>
    </div>
  );
};

export default Header;

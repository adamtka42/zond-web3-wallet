import withSuspense from "@/functions/withSuspense";
import { lazy } from "react";

const Header = withSuspense(
  lazy(
    () =>
      import("@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Header/Header"),
  ),
);
const Body = withSuspense(
  lazy(
    () => import("@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/Body"),
  ),
);

const Wallet = () => {
  return (
    <>
      <Header />
      <Body />
    </>
  );
};

export default Wallet;

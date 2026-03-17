import withSuspense from "@/functions/withSuspense";
import { useStore } from "@/stores/store";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import { lazy } from "react";

const AccountCreateImport = withSuspense(
  lazy(
    () =>
      import(
        "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/Home/AccountCreateImport/AccountCreateImport"
      ),
  ),
);
const BackgroundVideo = withSuspense(
  lazy(
    () =>
      import(
        "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/Home/BackgroundVideo/BackgroundVideo"
      ),
  ),
);

const Home = observer(() => {
  const { qrlStore } = useStore();
  const { qrlConnection } = qrlStore;
  const { isLoading } = qrlConnection;

  return (
    <>
      <BackgroundVideo />
      <div className="relative z-10 flex w-full flex-col items-center p-8">
        {isLoading ? (
          <Loader className="animate-spin text-foreground" size="86" />
        ) : (
          <AccountCreateImport />
        )}
      </div>
    </>
  );
});

export default Home;

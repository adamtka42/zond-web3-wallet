import { useStore } from "@/stores/store";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import LockPassword from "./LockPassword/LockPassword";

const Lock = observer(() => {
  const { lockStore } = useStore();
  const { isLoading } = lockStore;

  return (
    <>
      <img
        className="absolute inset-0 h-full w-full animate-pulse overflow-hidden object-cover object-center"
        src="circuit.svg"
      />
      <div className="absolute inset-0 z-10 flex w-[23rem] flex-col items-center gap-12 p-8">
        <div className="relative flex flex-col gap-8">
          <img
            className="absolute -right-20 -top-16 z-0"
            src="icons/qrl/default.png"
          />
          <div className="relative z-10 text-6xl font-bold">
            Zond Web3 Wallet
          </div>
        </div>
        {isLoading ? (
          <Loader
            className="animate-spin text-foreground"
            size="86"
            data-testid="loader-icon"
          />
        ) : (
          <LockPassword />
        )}
      </div>
    </>
  );
});

export default Lock;

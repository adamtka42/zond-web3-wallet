import RouteMonitor from "@/components/ZondWeb3Wallet/RouteMonitor/RouteMonitor";
import ScreenLoader from "@/components/ZondWeb3Wallet/ScreenLoader/ScreenLoader";
import { TooltipProvider } from "../UI/Tooltip";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/store";
import { cva } from "class-variance-authority";

const zondWalletBodyClasses = cva(
  "relative flex h-[48rem] w-[23rem] flex-col bg-background text-foreground",
  {
    variants: {
      isPopupWindow: {
        false: [
          "overflow-y-scroll overflow-x-hidden border-2 rounded-md shadow-2xl",
        ],
      },
    },
    defaultVariants: {
      isPopupWindow: true,
    },
  },
);

const ZondWeb3Wallet = observer(() => {
  const { settingsStore } = useStore();
  const { isPopupWindow } = settingsStore;

  return (
    <div
      className={zondWalletBodyClasses({
        isPopupWindow,
      })}
    >
      <RouteMonitor />
      <TooltipProvider>
        <ScreenLoader />
      </TooltipProvider>
    </div>
  );
});

export default ZondWeb3Wallet;

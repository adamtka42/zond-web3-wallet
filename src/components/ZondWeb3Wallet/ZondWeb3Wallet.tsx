import RouteMonitor from "@/components/ZondWeb3Wallet/RouteMonitor/RouteMonitor";
import ScreenLoader from "@/components/ZondWeb3Wallet/ScreenLoader/ScreenLoader";
import { TooltipProvider } from "../UI/Tooltip";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/store";
import { cva } from "class-variance-authority";

const zondWalletBodyClasses = cva(
  "relative flex w-[23rem] flex-col bg-background text-foreground",
  {
    variants: {
      isPopupWindow: {
        true: ["h-[48rem]"],
        false: [
          "h-[48rem] overflow-y-scroll overflow-x-hidden border-2 rounded-md shadow-2xl",
        ],
      },
      isSidePanel: {
        true: ["h-screen overflow-y-scroll overflow-x-hidden"],
      },
    },
    defaultVariants: {
      isPopupWindow: true,
      isSidePanel: false,
    },
  },
);

const ZondWeb3Wallet = observer(() => {
  const { settingsStore } = useStore();
  const { isPopupWindow, isSidePanel } = settingsStore;

  return (
    <div
      className={zondWalletBodyClasses({
        isPopupWindow: isSidePanel ? undefined : isPopupWindow,
        isSidePanel,
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

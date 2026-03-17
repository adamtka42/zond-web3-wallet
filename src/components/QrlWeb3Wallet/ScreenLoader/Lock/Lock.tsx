import { useStore } from "@/stores/store";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import LockPassword from "./LockPassword/LockPassword";

const Lock = observer(() => {
  const { lockStore } = useStore();
  const { isLoading } = lockStore;
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-full w-full flex-1 flex-col items-center gap-12 p-8">
      <img
        className="absolute inset-0 h-full w-full animate-pulse overflow-hidden object-cover object-center"
        src="circuit.svg"
      />
      <div className="relative z-10 flex flex-col gap-8">
        <img
          className="absolute -right-20 -top-16 z-0"
          src="icons/qrl/default.png"
        />
        <div className="relative z-10 text-6xl font-bold">
          {t("lock.title")}
        </div>
      </div>
      <div className="relative z-10 w-full">
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
    </div>
  );
});

export default Lock;

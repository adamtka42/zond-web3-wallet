import { useStore } from "@/stores/store";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import CircuitBackground from "../Shared/CircuitBackground/CircuitBackground";
import DAppRequestContentSelection from "./DAppRequestContentSelection/DAppRequestContentSelection";

const DAppRequest = observer(() => {
  const { zondStore, dAppRequestStore } = useStore();
  const { zondConnection } = zondStore;
  const { isLoading } = zondConnection;
  const { approvalProcessingStatus } = dAppRequestStore;
  const { hasCompleted } = approvalProcessingStatus;

  useEffect(() => {
    if (hasCompleted) {
      window.close();
    }
  }, [hasCompleted]);

  if (isLoading) {
    return (
      <div className="flex justify-center pt-48">
        <Loader className="animate-spin" size={86} />
      </div>
    );
  }

  return (
    <>
      <CircuitBackground />
      <div className="relative z-10 flex flex-col items-center space-y-4 p-4">
        <DAppRequestContentSelection />
      </div>
    </>
  );
});

export default DAppRequest;

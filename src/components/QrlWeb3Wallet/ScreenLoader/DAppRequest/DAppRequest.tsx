import { useStore } from "@/stores/store";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import CircuitBackground from "../Shared/CircuitBackground/CircuitBackground";
import DAppRequestContentSelection from "./DAppRequestContentSelection/DAppRequestContentSelection";
import PhishingWarning from "./PhishingWarning/PhishingWarning";

const DAppRequest = observer(() => {
  const { qrlStore, dAppRequestStore, settingsStore } = useStore();
  const { qrlConnection } = qrlStore;
  const { isLoading } = qrlConnection;
  const { dAppRequestData, approvalProcessingStatus, onPermission } =
    dAppRequestStore;
  const { hasCompleted } = approvalProcessingStatus;
  const { phishingDetectionEnabled } = settingsStore;

  const [phishingAcknowledged, setPhishingAcknowledged] = useState(false);

  const phishingResult = dAppRequestData?.phishingResult;
  const isDomainPhishing =
    phishingDetectionEnabled && (phishingResult?.isDomainPhishing ?? false);
  const showPhishingWarning = isDomainPhishing && !phishingAcknowledged;

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

  const senderUrl = dAppRequestData?.requestData?.senderData?.url ?? "";
  let domain = "";
  try {
    domain = new URL(senderUrl).hostname;
  } catch {
    // invalid URL
  }

  return (
    <>
      <CircuitBackground />
      <div className="relative z-10 flex flex-col items-center space-y-4 p-4">
        <DAppRequestContentSelection />
      </div>
      <PhishingWarning
        isOpen={showPhishingWarning}
        domain={domain}
        matchedDomain={phishingResult?.matchedDomain}
        onReject={() => onPermission(false)}
        onProceedAnyway={() => setPhishingAcknowledged(true)}
      />
    </>
  );
});

export default DAppRequest;

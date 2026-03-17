import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import QrlSendTransactionForContent from "./QrlSendTransactionForContent/QrlSendTransactionForContent";
import { useEffect, useState } from "react";

export const SEND_TRANSACTION_TYPES = {
  CONTRACT_DEPLOYMENT: "CONTRACT_DEPLOYMENT",
  CONTRACT_INTERACTION: "CONTRACT_INTERACTION",
  QRL_TRANSFER: "QRL_TRANSFER",
  UNKNOWN: "UNKNOWN",
} as const;

const QrlSendTransaction = observer(() => {
  const { t } = useTranslation();
  const { dAppRequestStore } = useStore();
  const { dAppRequestData } = dAppRequestStore;

  const [transactionHeading, setTransactionHeading] = useState("");
  const [transactionSubHeading, setTransactionSubHeading] = useState("");
  const [transactionType, setTransactionType] = useState<
    keyof typeof SEND_TRANSACTION_TYPES
  >(SEND_TRANSACTION_TYPES.UNKNOWN);

  useEffect(() => {
    const params = dAppRequestData?.params[0];
    if (!params || typeof params !== "object") {
      return;
    }
    const { to, value, data } = params;
    if (!to && data) {
      setTransactionHeading(t('dapp.sendTransaction.contractDeploy'));
      setTransactionSubHeading(t('dapp.sendTransaction.contractDeployDescription'));
      setTransactionType(SEND_TRANSACTION_TYPES.CONTRACT_DEPLOYMENT);
    } else if (to && data) {
      setTransactionHeading(t('dapp.sendTransaction.contractInteract'));
      setTransactionSubHeading(t('dapp.sendTransaction.contractInteractDescription'));
      setTransactionType(SEND_TRANSACTION_TYPES.CONTRACT_INTERACTION);
    } else if (to && value && !data) {
      setTransactionHeading(t('dapp.sendTransaction.transferQrl'));
      setTransactionSubHeading(t('dapp.sendTransaction.transferQrlDescription'));
      setTransactionType(SEND_TRANSACTION_TYPES.QRL_TRANSFER);
    }
  }, [dAppRequestData]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-2xl font-bold">{transactionHeading}</div>
        <div>{transactionSubHeading}</div>
      </div>
      <div className="flex flex-col gap-4">
        <QrlSendTransactionForContent transactionType={transactionType} />
      </div>
    </div>
  );
});

export default QrlSendTransaction;

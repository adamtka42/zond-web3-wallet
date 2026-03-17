import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import QrlSignTypedDataV4Content from "./QrlSignTypedDataV4Content/QrlSignTypedDataV4Content";
import { useStore } from "@/stores/store";
import { RESTRICTED_METHODS } from "@/scripts/constants/requestConstants";
import PersonalSign from "./PersonalSign/PersonalSign";

const QrlSignTypedDataV4 = observer(() => {
  const { t } = useTranslation();
  const { dAppRequestStore } = useStore();
  const { dAppRequestData } = dAppRequestStore;
  const method = dAppRequestData?.method;
  const isQrlSignTypedDataV4 =
    method === RESTRICTED_METHODS.QRL_SIGN_TYPED_DATA_V4;
  const isPersonalSign = method === RESTRICTED_METHODS.PERSONAL_SIGN;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-2xl font-bold">{t('dapp.signature.title')}</div>
        <div>{t('dapp.signature.description')}</div>
      </div>
      <div className="flex flex-col gap-4">
        {isQrlSignTypedDataV4 && <QrlSignTypedDataV4Content />}
        {isPersonalSign && <PersonalSign />}
      </div>
    </div>
  );
});

export default QrlSignTypedDataV4;

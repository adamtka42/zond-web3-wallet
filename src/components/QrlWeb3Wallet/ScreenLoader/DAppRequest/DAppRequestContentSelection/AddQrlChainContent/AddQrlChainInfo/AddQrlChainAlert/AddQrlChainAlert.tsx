import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

const AddQrlChainAlert = () => {
  const { t } = useTranslation();
  return (
    <Alert className="mt-2">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>{t('common.careful')}</AlertTitle>
      <AlertDescription className="text-xs">
        {t('dapp.addChain.warning')}
      </AlertDescription>
    </Alert>
  );
};

export default AddQrlChainAlert;

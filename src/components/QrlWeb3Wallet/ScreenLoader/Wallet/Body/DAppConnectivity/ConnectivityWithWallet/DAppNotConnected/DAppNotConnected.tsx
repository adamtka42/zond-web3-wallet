import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import { Unlink } from "lucide-react";
import { useTranslation } from "react-i18next";

const DAppNotConnected = () => {
  const { t } = useTranslation();
  return (
    <Alert>
      <Unlink className="h-4 w-4" data-testid="unlink-icon" />
      <AlertTitle>{t('dapp.notConnected')}</AlertTitle>
      <AlertDescription>
        {t('dapp.notConnectedDescription')}
      </AlertDescription>
    </Alert>
  );
};

export default DAppNotConnected;

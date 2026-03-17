import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/UI/AlertDialog";
import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

type PhishingWarningProps = {
  isOpen: boolean;
  domain: string;
  matchedDomain?: string;
  onReject: () => void;
  onProceedAnyway: () => void;
};

const PhishingWarning = ({
  isOpen,
  domain,
  matchedDomain,
  onReject,
  onProceedAnyway,
}: PhishingWarningProps) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="w-80 rounded-md">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            {t("phishing.warningTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("phishing.warningDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>{domain}</AlertTitle>
          <AlertDescription className="text-xs">
            {matchedDomain
              ? t("phishing.matchedDomain", { domain: matchedDomain })
              : t("phishing.suspiciousDomain")}
          </AlertDescription>
        </Alert>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogCancel onClick={onReject} className="w-full">
            {t("phishing.rejectButton")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onProceedAnyway}
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("phishing.proceedButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PhishingWarning;

import { Button } from "@/components/UI/Button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { Web3BaseWalletAccount } from "@theqrl/web3";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import BackButton from "../../../../Shared/BackButton/BackButton";

type StartAccountCreationProps = {
  onAccountCreated: (account?: Web3BaseWalletAccount) => void;
};

const StartAccountCreation = observer(
  ({ onAccountCreated }: StartAccountCreationProps) => {
    const { t } = useTranslation();
    const { qrlStore } = useStore();
    const { qrlInstance } = qrlStore;

    const onAddAccount = () => {
      const newAccount = qrlInstance?.accounts.create();
      onAccountCreated(newAccount);
    };

    return (
      <>
        <BackButton />
        <Card>
          <CardHeader>
            <CardTitle>{t('createAccount.title')}</CardTitle>
            <CardDescription className="break-words">
              {t('createAccount.description')}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={onAddAccount}>
              <Plus className="mr-2 h-4 w-4" />
              {t('createAccount.button')}
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  },
);

export default StartAccountCreation;

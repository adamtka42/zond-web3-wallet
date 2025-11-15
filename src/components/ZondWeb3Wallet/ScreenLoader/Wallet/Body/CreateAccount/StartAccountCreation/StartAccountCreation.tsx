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
import BackButton from "../../../../Shared/BackButton/BackButton";

type StartAccountCreationProps = {
  onAccountCreated: (account?: Web3BaseWalletAccount) => void;
};

const StartAccountCreation = observer(
  ({ onAccountCreated }: StartAccountCreationProps) => {
    const { zondStore } = useStore();
    const { zondInstance } = zondStore;

    const onAddAccount = () => {
      const newAccount = zondInstance?.accounts.create();
      onAccountCreated(newAccount);
    };

    return (
      <>
        <BackButton />
        <Card>
          <CardHeader>
            <CardTitle>Create a new account</CardTitle>
            <CardDescription className="break-words">
              You can add a new account to this wallet. After creating the
              account, ensure you keep the account recovery phrases safe.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={onAddAccount}>
              <Plus className="mr-2 h-4 w-4" />
              Create account
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  },
);

export default StartAccountCreation;

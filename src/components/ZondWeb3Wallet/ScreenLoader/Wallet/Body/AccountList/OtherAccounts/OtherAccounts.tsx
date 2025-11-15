import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { Label } from "@/components/UI/Label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { ArrowRight, Copy } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import AccountId from "../AccountId/AccountId";

const OtherAccounts = observer(() => {
  const navigate = useNavigate();
  const { zondStore } = useStore();
  const { zondAccounts, activeAccount, setActiveAccount } = zondStore;
  const { accountAddress: activeAccountAddress } = activeAccount;
  const { accounts } = zondAccounts;

  const otherAccountsLabel = `${activeAccountAddress ? "Other accounts" : "Accounts"} in the wallet`;
  const otherAccounts = accounts.filter(
    ({ accountAddress }) => accountAddress !== activeAccountAddress,
  );

  const copyAccount = (accountAddress: string) => {
    navigator.clipboard.writeText(accountAddress);
  };

  const onAccountSwitch = async (accountAddress: string) => {
    await StorageUtil.clearTransactionValues();
    navigate(ROUTES.HOME);
    await setActiveAccount(accountAddress);
  };

  return (
    !!otherAccounts.length && (
      <div className="flex flex-col gap-2">
        <Label className="text-lg">{otherAccountsLabel}</Label>
        {otherAccounts.map(({ accountAddress }) => (
          <Card
            key={accountAddress}
            id={accountAddress}
            className="flex gap-3 p-3 font-bold text-foreground"
          >
            <AccountId account={accountAddress} />
            <div className="flex flex-col gap-2">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className="size-7 hover:bg-accent hover:text-secondary"
                    variant="outline"
                    size="icon"
                    aria-label="Switch to this account"
                    onClick={() => {
                      onAccountSwitch(accountAddress);
                    }}
                  >
                    <ArrowRight size="18" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <Label>Switch to this account</Label>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className="size-7 hover:bg-accent hover:text-secondary"
                    variant="outline"
                    size="icon"
                    aria-label="Copy Address"
                    onClick={() => {
                      copyAccount(accountAddress);
                    }}
                  >
                    <Copy size="16" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <Label>Copy Address</Label>
                </TooltipContent>
              </Tooltip>
            </div>
          </Card>
        ))}
      </div>
    )
  );
});

export default OtherAccounts;

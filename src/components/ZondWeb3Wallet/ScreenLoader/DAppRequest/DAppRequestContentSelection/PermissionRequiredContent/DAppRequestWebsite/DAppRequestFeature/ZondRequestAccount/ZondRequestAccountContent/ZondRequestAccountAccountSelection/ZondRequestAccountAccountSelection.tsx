import { Checkbox } from "@/components/UI/Checkbox";
import AccountId from "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/AccountId/AccountId";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

type ZondRequestAccountAccountSelectionProps = {
  selectedAccounts: string[];
  onAccountSelection: (selectedAccount: string, checked: boolean) => void;
};

const ZondRequestAccountAccountSelection = observer(
  ({
    selectedAccounts,
    onAccountSelection,
  }: ZondRequestAccountAccountSelectionProps) => {
    const { t } = useTranslation();
    const { zondStore } = useStore();
    const { zondAccounts } = zondStore;
    const { accounts, isLoading } = zondAccounts;
    const availableAccounts = accounts.map((account) => account.accountAddress);

    const hasAccounts = !!availableAccounts?.length;

    return (
      <div className="flex flex-col gap-4">
        <div>{t('dapp.selectAccounts')}</div>
        {isLoading ? (
          <div className="flex h-12 w-full animate-pulse items-center justify-between">
            <div className="h-full w-full rounded-md bg-accent" />
          </div>
        ) : hasAccounts ? (
          <div className="flex flex-col gap-3">
            {availableAccounts.map((account) => (
              <div key={account} className="flex items-start space-x-3">
                <Checkbox
                  id={account}
                  checked={selectedAccounts.includes(account)}
                  aria-label="accountsCheckbox"
                  onCheckedChange={(checked) =>
                    onAccountSelection(account, !!checked)
                  }
                />
                <label
                  htmlFor={account}
                  className="cursor-pointer text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <AccountId account={account} />
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div>{t('dapp.noAccountsAvailable')}</div>
        )}
      </div>
    );
  },
);

export default ZondRequestAccountAccountSelection;

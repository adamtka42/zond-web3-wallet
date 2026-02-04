import { useStore } from "@/stores/store";
import StringUtil from "@/utilities/stringUtil";
import { Usb } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

type AccountIdType = {
  account: string;
};

const AccountId = observer(({ account }: AccountIdType) => {
  const { zondStore, ledgerStore } = useStore();
  const { getAccountBalance, zondAccounts } = zondStore;
  const { accounts } = zondAccounts;
  const { prefix, addressSplit } = StringUtil.getSplitAddress(account);

  const [accountBalance, setAccountBalance] = useState("");
  const isLedgerAccount = ledgerStore.isLedgerAccount(account);

  useEffect(() => {
    setAccountBalance(getAccountBalance(account));
  }, [accounts]);

  return (
    <div className="flex gap-1">
      <div className="flex items-center gap-1">
        <div className="text-xs">{prefix}</div>
        {isLedgerAccount && (
          <span title="Ledger account">
            <Usb className="h-3 w-3 text-muted-foreground" />
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-1">
          {addressSplit.map((part) => (
            <div className="text-xs" key={part}>
              {part}
            </div>
          ))}
        </div>
        <div className="text-xs text-secondary">{accountBalance}</div>
      </div>
    </div>
  );
});

export default AccountId;

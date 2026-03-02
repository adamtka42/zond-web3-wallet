import ActiveAccount from "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/ActiveAccount/ActiveAccount";
import NewAccount from "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/NewAccount/NewAccount";
import OtherAccounts from "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/OtherAccounts/OtherAccounts";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import BackButton from "../../../Shared/BackButton/BackButton";

const AccountList = observer(() => {
  const { zondStore, ledgerStore, accountLabelsStore } = useStore();
  const { zondAccounts } = zondStore;

  useEffect(() => {
    accountLabelsStore.syncLabels(
      zondAccounts.accounts,
      ledgerStore.isLedgerAccount.bind(ledgerStore),
    );
  }, [zondAccounts.accounts]);

  return (
    <div className="flex w-full flex-col gap-2 p-8">
      <BackButton navigationRoute={ROUTES.HOME} />
      <div className="flex flex-col gap-8">
        <NewAccount />
        <ActiveAccount />
        <OtherAccounts />
      </div>
    </div>
  );
});

export default AccountList;

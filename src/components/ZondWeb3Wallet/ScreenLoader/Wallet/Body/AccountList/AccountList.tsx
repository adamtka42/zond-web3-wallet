import ActiveAccount from "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/ActiveAccount/ActiveAccount";
import NewAccount from "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/NewAccount/NewAccount";
import OtherAccounts from "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/OtherAccounts/OtherAccounts";
import BackButton from "../../../Shared/BackButton/BackButton";
import { ROUTES } from "@/router/router";

const AccountList = () => {
  return (
    <div className="flex flex-col gap-2 p-8">
      <BackButton navigationRoute={ROUTES.HOME} />
      <div className="flex flex-col gap-8">
        <NewAccount />
        <ActiveAccount />
        <OtherAccounts />
      </div>
    </div>
  );
};

export default AccountList;

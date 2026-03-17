import { useStore } from "@/stores/store";
import StringUtil from "@/utilities/stringUtil";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

const AccountAddressDisplay = observer(() => {
  const { qrlStore } = useStore();
  const { t } = useTranslation();
  const { activeAccount } = qrlStore;
  const { accountAddress } = activeAccount;

  const { prefix, addressSplit } = StringUtil.getSplitAddress(accountAddress);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-secondary">{t("onboarding.account.addressLabel")}</div>
      <div className="font-bold">
        {prefix} {addressSplit.join(" ")}
      </div>
    </div>
  );
});

export default AccountAddressDisplay;

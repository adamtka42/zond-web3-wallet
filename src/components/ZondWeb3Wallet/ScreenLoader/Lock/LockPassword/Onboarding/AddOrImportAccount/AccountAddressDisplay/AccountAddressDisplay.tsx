import { useStore } from "@/stores/store";
import StringUtil from "@/utilities/stringUtil";
import { observer } from "mobx-react-lite";

const AccountAddressDisplay = observer(() => {
  const { zondStore } = useStore();
  const { activeAccount } = zondStore;
  const { accountAddress } = activeAccount;

  const { prefix, addressSplit } = StringUtil.getSplitAddress(accountAddress);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-secondary">Account address</div>
      <div className="font-bold">
        {prefix} {addressSplit.join(" ")}
      </div>
    </div>
  );
});

export default AccountAddressDisplay;

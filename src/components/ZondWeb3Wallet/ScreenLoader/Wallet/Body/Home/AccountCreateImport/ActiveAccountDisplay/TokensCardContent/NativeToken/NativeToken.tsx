import { NATIVE_TOKEN } from "@/constants/nativeToken";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import TokenListItem from "../TokenListItem/TokenListItem";

const NativeToken = observer(() => {
  const { zondStore } = useStore();
  const { activeAccount, getAccountBalance } = zondStore;
  const { accountAddress } = activeAccount;

  return (
    <TokenListItem
      image={NATIVE_TOKEN.image}
      balance={getAccountBalance(accountAddress)}
      name={NATIVE_TOKEN.name}
      symbol={NATIVE_TOKEN.symbol}
    />
  );
});

export default NativeToken;

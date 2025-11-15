import { observer } from "mobx-react-lite";
import NativeToken from "./NativeToken/NativeToken";
import ZRC20Tokens from "./ZRC20Tokens/ZRC20Tokens";

const TokensCardContent = observer(() => {
  return (
    <div className="flex flex-col gap-2">
      <NativeToken />
      <ZRC20Tokens />
    </div>
  );
});

export default TokensCardContent;

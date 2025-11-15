import { Button } from "@/components/UI/Button";
import { Label } from "@/components/UI/Label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { getHexSeedFromMnemonic } from "@/functions/getHexSeedFromMnemonic";
import { useStore } from "@/stores/store";
import StringUtil from "@/utilities/stringUtil";
import { Dilithium } from "@theqrl/wallet.js";
import { bytesToHex } from "@theqrl/web3-utils";
import { parseAndValidateSeed } from "@theqrl/web3-zond-accounts";
import { Buffer } from "buffer";
import { Copy } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const PersonalSign = observer(() => {
  const { lockStore, zondStore, dAppRequestStore } = useStore();
  const { getMnemonicPhrases } = lockStore;
  const { zondInstance, zondConnection } = zondStore;
  const { isConnected } = zondConnection;
  const {
    dAppRequestData,
    setOnPermissionCallBack,
    setCanProceed,
    addToResponseData,
  } = dAppRequestStore;

  const params = dAppRequestData?.params;
  const challenge = Buffer.from(params?.[0]?.slice(2) ?? "", "hex").toString(
    "utf8",
  );
  const fromAddress = params?.[1] ?? "";
  const { prefix: prefixFromAddress, addressSplit: addressSplitFromAddress } =
    StringUtil.getSplitAddress(fromAddress);

  useEffect(() => {
    if (isConnected) {
      const onPermissionCallBack = async (hasApproved: boolean) => {
        if (hasApproved) {
          personalSign();
        }
      };
      setOnPermissionCallBack(onPermissionCallBack);
    }
  }, [isConnected]);

  const copyMessage = () => {
    navigator.clipboard.writeText(challenge);
  };

  const personalSign = async () => {
    try {
      const mnemonicPhrases = await getMnemonicPhrases(fromAddress ?? "");
      const seed = getHexSeedFromMnemonic(mnemonicPhrases);
      const addressFromMnemonic =
        zondInstance?.accounts.seedToAccount(seed)?.address;
      if (fromAddress !== addressFromMnemonic) {
        throw new Error("Mnemonic phrases did not match with the address");
      }
      const signature = zondInstance?.accounts.sign(
        params?.[0],
        seed,
      )?.signature;

      const seedUint8Array = parseAndValidateSeed(seed);
      const buf = Buffer.from(seedUint8Array);
      const acc = new Dilithium(buf);
      const publicKey = bytesToHex(acc.getPK());

      if (signature && publicKey) {
        addToResponseData({
          signature,
          publicKey,
        });
      } else {
        throw new Error("Message data could not be signed");
      }
    } catch (error) {
      addToResponseData({ error });
    }
  };

  useEffect(() => {
    setCanProceed(true);
  }, []);

  return (
    <div className="flex flex-col gap-2 rounded-md p-2">
      <div className="flex flex-col gap-1">
        <div>From Address</div>
        <div className="w-64 font-bold text-secondary">{`${prefixFromAddress} ${addressSplitFromAddress.join(" ")}`}</div>
      </div>
      <div className="flex flex-col gap-1">
        <div>Message</div>
        <div className="flex justify-between gap-2">
          <div className="max-h-[8rem] w-full overflow-hidden break-words font-bold text-secondary">
            {challenge}
          </div>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-8 hover:text-secondary"
                variant="outline"
                size="icon"
                aria-label="Copy message"
                onClick={copyMessage}
              >
                <Copy size="16" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <Label>Copy Message</Label>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
});

export default PersonalSign;

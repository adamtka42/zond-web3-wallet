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
import { Copy, Send } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import AccountId from "../AccountId/AccountId";

const ActiveAccount = observer(() => {
  const { zondStore } = useStore();
  const { activeAccount } = zondStore;
  const { accountAddress } = activeAccount;

  const activeAccountLabel = `${accountAddress ? "Active account" : ""}`;

  const copyAccount = () => {
    navigator.clipboard.writeText(accountAddress);
  };

  return (
    !!accountAddress && (
      <div className="flex flex-col gap-2">
        <Label className="text-lg">{activeAccountLabel}</Label>
        <Card className="flex w-full flex-col gap-3 p-3 font-bold text-foreground">
          <div className="flex gap-3">
            <AccountId account={accountAddress} />
            <div className="flex flex-col gap-2">
              <Link
                className="w-full"
                to={ROUTES.TOKEN_TRANSFER}
                state={{ shouldStartFresh: true }}
                aria-label="Send Quanta"
              >
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      className="size-7 hover:bg-accent hover:text-secondary"
                      variant="outline"
                      size="icon"
                      aria-label="Send Quanta"
                    >
                      <Send size="16" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <Label>Send Quanta</Label>
                  </TooltipContent>
                </Tooltip>
              </Link>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className="size-7 hover:bg-accent hover:text-secondary"
                    variant="outline"
                    size="icon"
                    aria-label="Copy Address"
                    onClick={copyAccount}
                  >
                    <Copy size="16" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <Label>Copy Address</Label>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </Card>
      </div>
    )
  );
});

export default ActiveAccount;

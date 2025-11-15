import { Button } from "@/components/UI/Button";
import { Label } from "@/components/UI/Label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import StringUtil from "@/utilities/stringUtil";
import { cva } from "class-variance-authority";
import { Wallet } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Link, useLocation } from "react-router-dom";

const badgeButtonClasses = cva(
  "flex items-center gap-1 rounded-full text-xs text-foreground",
  {
    variants: {
      isActive: {
        true: ["bg-accent"],
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

const AccountBadge = observer(() => {
  const location = useLocation();
  const pathName = location.pathname;
  const { zondStore } = useStore();
  const { activeAccount } = zondStore;
  const { accountAddress } = activeAccount;

  const { prefix, addressSplit } = StringUtil.getSplitAddress(accountAddress);
  const account = `${prefix}${addressSplit[0]}...${addressSplit[addressSplit.length - 1]}`;

  return (
    !!accountAddress && (
      <Link to={ROUTES.ACCOUNT_LIST}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={badgeButtonClasses({
                isActive: pathName === ROUTES.ACCOUNT_LIST,
              })}
            >
              <Wallet className="h-3 w-3" />
              {account}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <Label>Accounts</Label>
          </TooltipContent>
        </Tooltip>
      </Link>
    )
  );
});

export default AccountBadge;

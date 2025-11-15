import { Label } from "@/components/UI/Label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { ROUTES } from "@/router/router";
import { Link } from "react-router-dom";

const ZondWeb3WalletLogo = () => {
  return (
    <Link to={ROUTES.HOME}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <img
            className="h-6 w-6"
            src="icons/qrl/default.png"
            alt="Zond Web3 Wallet Logo"
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <Label>Home</Label>
        </TooltipContent>
      </Tooltip>
    </Link>
  );
};

export default ZondWeb3WalletLogo;

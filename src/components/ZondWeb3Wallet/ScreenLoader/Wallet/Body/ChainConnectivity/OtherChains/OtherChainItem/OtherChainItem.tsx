import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/DropdownMenu";
import { Label } from "@/components/UI/Label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import { Check, EllipsisVertical, Pencil, Trash, Wifi, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChainIcon from "../../ChainIcon/ChainIcon";
import StorageUtil from "@/utilities/storageUtil";
import {
  excludeChainForUrlOrigin,
  includeChainForUrlOrigin,
} from "@/scripts/utils/restrictedMethodsMiddlewareUtils";

type OtherChainItemProps = {
  blockchain: BlockchainDataType;
  triggerReRender: () => void;
};

const OtherChainItem = observer(
  ({ blockchain, triggerReRender }: OtherChainItemProps) => {
    const navigate = useNavigate();
    const { dAppRequestStore, zondStore } = useStore();
    const { selectBlockchain } = zondStore;
    const { defaultRpcUrl, chainName, chainId, defaultIconUrl, isCustomChain } =
      blockchain;
    const { currentTabData } = dAppRequestStore;

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const connectChain = async (chainId: string) => {
      navigate(ROUTES.HOME);
      await includeChainForUrlOrigin({
        urlOrigin: currentTabData?.urlOrigin ?? "",
        chainId,
      });
      selectBlockchain(chainId);
    };

    const deleteChain = async (chainId: string) => {
      setDeleteDialogOpen(false);
      const blockchains = await StorageUtil.getAllBlockChains();
      const updatedChains = blockchains.filter(
        (chain) => chain.chainId !== chainId,
      );
      await StorageUtil.setAllBlockChains(updatedChains);
      await excludeChainForUrlOrigin({
        urlOrigin: currentTabData?.urlOrigin ?? "",
        chainId,
      });
      triggerReRender();
    };

    return (
      <Card className="flex justify-between gap-4 p-4">
        <div className="flex gap-4">
          <div className="pt-1">
            <ChainIcon src={defaultIconUrl} alt={chainName} />
          </div>
          <div className="flex flex-col break-all">
            <span className="font-bold">{chainName}</span>
            <span className="text-xm opacity-80">
              Chain ID {parseInt(chainId, 16)}
            </span>
            <span className="text-xm opacity-80">{defaultRpcUrl}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                className="size-7 hover:bg-accent hover:text-secondary"
                variant="outline"
                size="icon"
                aria-label="Connect chain"
                onClick={() => {
                  connectChain(chainId);
                }}
              >
                <Wifi size="16" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <Label>Connect chain</Label>
            </TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="size-7 hover:bg-accent hover:text-secondary"
                variant="outline"
                size="icon"
                aria-label="More"
              >
                <EllipsisVertical size="16" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <Link
                  to={ROUTES.ADD_EDIT_CHAIN}
                  state={{ hasState: true, chainId }}
                  aria-label="Edit chain"
                >
                  <DropdownMenuItem className="cursor-pointer data-[highlighted]:text-secondary">
                    <div className="flex gap-2">
                      <Pencil size="16" />
                      <button aria-label="Edit chain">Edit chain</button>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  disabled={!isCustomChain}
                  className="cursor-pointer data-[highlighted]:text-secondary"
                  onClick={() => {
                    setDeleteDialogOpen(true);
                  }}
                >
                  <div className="flex gap-2">
                    <Trash size="16" />
                    <button disabled={!isCustomChain} aria-label="Delete chain">
                      Delete chain
                    </button>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="w-80 rounded-md">
              <DialogHeader className="text-left">
                <DialogTitle>Delete chain</DialogTitle>
                <DialogDescription>
                  Do you want to delete the chain '{chainName}'?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-row gap-4">
                <DialogClose asChild>
                  <Button
                    className="w-full"
                    type="button"
                    variant="outline"
                    aria-label="Cancel Delete"
                  >
                    <X className="mr-2 h-4 w-4" />
                    No
                  </Button>
                </DialogClose>
                <Button
                  className="w-full"
                  type="button"
                  aria-label="Confirm Delete"
                  onClick={() => {
                    deleteChain(chainId);
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Yes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    );
  },
);

export default OtherChainItem;

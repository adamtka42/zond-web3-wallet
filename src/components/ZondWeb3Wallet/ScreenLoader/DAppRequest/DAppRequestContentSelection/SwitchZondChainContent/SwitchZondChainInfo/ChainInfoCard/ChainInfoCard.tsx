import { Card } from "@/components/UI/Card";
import ChainIcon from "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/ChainIcon/ChainIcon";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";

type ChainInfoCardProps = {
  title: string;
  description: string;
  chain: BlockchainDataType;
};

const ChainInfoCard = ({ title, description, chain }: ChainInfoCardProps) => {
  const chainId = chain.chainId;
  const chainName = chain.chainName;
  const defaultIconUrl = chain.defaultIconUrl;
  const defaultRpcUrl = chain.defaultRpcUrl;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div>{title}</div>
        <div className="font-bold text-secondary">{description}</div>
      </div>
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
      </Card>
    </div>
  );
};

export default ChainInfoCard;

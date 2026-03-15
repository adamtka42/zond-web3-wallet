import { getRandomTailwindTextColor } from "@/utilities/stylingUtil";
import { FileBox } from "lucide-react";

type TokenDisplaySectionProps = {
  tokenImage: string;
  tokenSymbol: string;
  tokenName: string;
};

const TokenDisplaySection = ({
  tokenImage,
  tokenSymbol,
  tokenName,
}: TokenDisplaySectionProps) => {
  return (
    <div className="flex gap-6">
      {tokenImage ? (
        <img className="h-16 w-16" src={tokenImage} />
      ) : (
        <FileBox
          className={`shrink-0 ${getRandomTailwindTextColor(tokenSymbol)}`}
          size={64}
        />
      )}
      <div className="flex flex-col">
        <div className="text-2xl font-bold">{tokenSymbol}</div>
        <div className="text-lg">{tokenName}</div>
      </div>
    </div>
  );
};

export default TokenDisplaySection;

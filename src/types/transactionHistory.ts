export type TransactionHistoryEntry = {
  id: string;
  from: string;
  to: string;
  amount: number;
  tokenSymbol: string;
  tokenName: string;
  isZrc20Token: boolean;
  tokenContractAddress: string;
  tokenDecimals: number;
  transactionHash: string;
  blockNumber: string;
  gasUsed: string;
  effectiveGasPrice: string;
  status: boolean;
  timestamp: number;
  chainId: string;
};

export type TokenFilter = "all" | "native" | "zrc20";

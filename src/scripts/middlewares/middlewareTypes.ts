import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { AdditionalJsonRpcRequestKeys } from "@theqrl/zond-wallet-provider/utils";

export type DAppRequestType = {
  method: string;
  params?: any;
  requestData?: AdditionalJsonRpcRequestKeys;
};

export type DAppResponseType = {
  method: string;
  action: string;
  hasApproved: boolean;
  response?: any;
};

export const CAVEAT_TYPES = Object.freeze({
  RESTRICT_RETURNED_ACCOUNTS: "restrictReturnedAccounts",
  RESTRICT_NETWORK_SWITCHING: "restrictNetworkSwitching",
});

type CaveatsTypeType = (typeof CAVEAT_TYPES)[keyof typeof CAVEAT_TYPES];

type Caveat = {
  type: CaveatsTypeType;
  value: any;
};

export const PARENT_CAPABILITIES = Object.freeze({
  ZOND_ACCOUNTS: "zond_accounts",
  ZOND_CHAINS: "zond_chains",
});

type ParentCapabilityType =
  (typeof PARENT_CAPABILITIES)[keyof typeof PARENT_CAPABILITIES];

export type Permission = {
  invoker: string;
  parentCapability: ParentCapabilityType;
  caveats: Caveat[];
};

export type ConnectedAccountsDataType = {
  urlOrigin: string;
  accounts: string[];
  blockchains: BlockchainDataType[];
  permissions: Permission[];
};

export type TokenContractType = {
  address: string;
  symbol: string;
  decimals: number;
  image: string;
};

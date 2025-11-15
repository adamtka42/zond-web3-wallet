const ZOND_MAINNET_DATA = {
  chainId: "0x1",
  chainName: "Zond Mainnet",
  rpcUrls: ["http://127.0.0.1:8545"],
  blockExplorerUrls: ["https://www.theqrl.org/markets/"],
  nativeCurrency: {
    name: "Quanta",
    symbol: "ZND",
    decimals: 18,
  },
  iconUrls: ["icons/chains/zond_mainnet.svg"],
};

const ZOND_TESTNET_DATA = {
  chainId: "0x7e7e",
  chainName: "Zond Testnet",
  rpcUrls: ["http://209.250.255.226:8545"],
  blockExplorerUrls: ["https://www.theqrl.org/markets/"],
  nativeCurrency: {
    name: "Quanta",
    symbol: "ZND",
    decimals: 18,
  },
  iconUrls: ["icons/chains/zond_testnet.svg"],
};

export type BlockchainBaseDataType = typeof ZOND_MAINNET_DATA;

export type BlockchainAdditionalDataType = {
  defaultRpcUrl: string;
  defaultBlockExplorerUrl: string;
  defaultIconUrl: string;
  isTestnet: boolean;
  defaultWsRpcUrl: string;
  isCustomChain: boolean;
};

export type BlockchainDataType = BlockchainBaseDataType &
  BlockchainAdditionalDataType;

export const ZOND_BLOCKCHAINS: BlockchainDataType[] = [
  {
    ...ZOND_MAINNET_DATA,
    defaultRpcUrl: ZOND_MAINNET_DATA.rpcUrls[0],
    defaultBlockExplorerUrl: ZOND_MAINNET_DATA.blockExplorerUrls[0],
    defaultIconUrl: ZOND_MAINNET_DATA.iconUrls[0],
    isTestnet: false,
    defaultWsRpcUrl: "http://localhost:3000",
    isCustomChain: false,
  },
  {
    ...ZOND_TESTNET_DATA,
    defaultRpcUrl: ZOND_TESTNET_DATA.rpcUrls[0],
    defaultBlockExplorerUrl: ZOND_TESTNET_DATA.blockExplorerUrls[0],
    defaultIconUrl: ZOND_TESTNET_DATA.iconUrls[0],
    isTestnet: true,
    defaultWsRpcUrl: "http://localhost:3000",
    isCustomChain: false,
  },
];

export const DEFAULT_BLOCKCHAIN = ZOND_BLOCKCHAINS[0];

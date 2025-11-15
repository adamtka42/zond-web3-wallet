import {
  BlockchainDataType,
  DEFAULT_BLOCKCHAIN,
} from "@/configuration/zondBlockchainConfig";
import { StoreType } from "@/stores/store";
import { Web3BaseWalletAccount } from "@theqrl/web3";
import deepmerge from "deepmerge";
import { createContext, useContext } from "react";
import type { PartialDeep } from "type-fest";

const mockedStoreValues: StoreType = {
  settingsStore: {
    isDarkMode: true,
    theme: "dark",
    isPopupWindow: true,
  },
  zondStore: {
    activeAccount: {
      accountAddress: "Z20B714091cF2a62DADda2847803e3f1B9D2D3779",
    },
    zondAccounts: {
      isLoading: false,
      accounts: [],
    },
    zondConnection: {
      isConnected: true,
      isLoading: false,
      blockchain: DEFAULT_BLOCKCHAIN,
    },
    zondInstance: undefined,
    fetchAccounts: async () => {},
    fetchZondConnection: async () => {},
    getAccountBalance: (accountAddress: string) => {
      accountAddress;
      return "0.0 ZND";
    },
    initializeBlockchain: async () => {},
    selectBlockchain: async (chainId: string) => {
      chainId;
    },
    setActiveAccount: async () => {},
    getNativeTokenGas: async () => {
      return "";
    },
    signAndSendNativeToken: async (
      from: string,
      to: string,
      value: number,
      mnemonicPhrases: string,
    ) => {
      from;
      to;
      value;
      mnemonicPhrases;
      return { transactionReceipt: undefined, error: "" };
    },
    validateActiveAccount: async () => {},
    getGasFeeData: async () => {
      return {
        baseFeePerGas: BigInt(0),
        maxFeePerGas: BigInt(0),
        maxPriorityFeePerGas: "0",
      };
    },
    getZrc20TokenDetails: async () => ({
      token: undefined,
      error: "",
    }),
    getZrc20TokenGas: async (
      from: string,
      to: string,
      value: number,
      contractAddress: string,
      decimals: number,
    ) => {
      from;
      to;
      value;
      contractAddress;
      decimals;
      return "";
    },
    signAndSendZrc20Token: async (
      from: string,
      to: string,
      value: number,
      mnemonicPhrases: string,
      contractAddress: string,
      decimals: number,
    ) => {
      from;
      to;
      value;
      mnemonicPhrases;
      contractAddress;
      decimals;
      return { transactionReceipt: undefined, error: "" };
    },
    refreshBlockchainData: async () => {},
    addChain: async (chainData: BlockchainDataType) => {
      chainData;
      return { chainFound: false, updatedChainList: [] };
    },
    editChain: async (chainData: BlockchainDataType) => {
      chainData;
      return { updatedChainList: [] };
    },
  },
  dAppRequestStore: {
    dAppRequestData: {
      method: "zond_requestAccounts",
      requestData: {
        senderData: {
          tabId: 1,
          title: "Mocked Page Title",
          url: "http://localhost/",
          favIconUrl: "http://localhost/mocked-fav-icon.svg",
        },
      },
    },
    hasDAppConnected: false,
    hasDAppRequest: true,
    responseData: undefined,
    canProceed: false,
    onPermissionCallBack: async (hasApproved: boolean) => {
      hasApproved;
    },
    approvalProcessingStatus: {
      hasApproved: false,
      isProcessing: false,
      hasCompleted: false,
    },
    readDAppRequestData: async () => {},
    addToResponseData: (data: any) => {
      data;
    },
    setCanProceed: (decision: boolean) => {
      decision;
    },
    setOnPermissionCallBack: (
      callBack: (hasApproved: boolean) => Promise<void>,
    ) => {
      callBack;
    },
    setApprovalProcessingStatus: async (status: {
      isProcessing?: boolean;
      hasApproved?: boolean;
      hasCompleted?: boolean;
    }) => {
      status;
    },
    onPermission: async (hasApproved: boolean) => {
      hasApproved;
    },
    fetchCurrentTabData: async () => {},
    disconnectFromCurrentTab: async () => {},
  },
  lockStore: {
    isServiceWorkerReady: true,
    hasPasswordSet: false,
    isLoading: false,
    isLocked: false,
    readLockState: async () => {},
    unlock: async (password: string) => {
      return !!password;
    },
    encryptAccount: async (
      account: Web3BaseWalletAccount,
      password: string,
    ) => {
      account;
      password;
    },
    keepServiceWorkerActive: () => {},
    initializePort: () => {},
    lock: async () => {},
    initializeStorageListener: () => {},
    getWalletPassword: async () => {
      return "";
    },
    getMnemonicPhrases: async (accountAddress: string) => {
      return accountAddress;
    },
  },
};

export const mockedStore = (
  overrideStoreValues: PartialDeep<StoreType> = {},
) => {
  return deepmerge(mockedStoreValues, overrideStoreValues) as StoreType;
};
const StoreContext = createContext(mockedStore);
export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;

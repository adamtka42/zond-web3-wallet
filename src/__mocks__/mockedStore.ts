import {
  BlockchainDataType,
  DEFAULT_BLOCKCHAIN,
} from "@/configuration/zondBlockchainConfig";
import LockStore from "@/stores/lockStore";
import SettingsStore from "@/stores/settingsStore";
import { StoreType } from "@/stores/store";
import ZondStore from "@/stores/zondStore";
import { Web3BaseWalletAccount } from "@theqrl/web3";
import deepmerge from "deepmerge";
import { createContext, useContext } from "react";
import type { PartialDeep } from "type-fest";

const mockedStoreValues: StoreType = {
  settingsStore: {
    isDarkMode: true,
    theme: "dark",
    isPopupWindow: true,
    isSidePanel: false,
    themePreference: "system",
    autoLockMinutes: 15,
    currency: "USD",
    language: "en",
    defaultGasTier: "market" as const,
    showBalanceAndPrice: true,
    sidePanelPreferred: false,
    setThemePreference: async () => {},
    setAutoLockMinutes: async () => {},
    setCurrency: async () => {},
    setLanguage: async () => {},
    setDefaultGasTier: async () => {},
    setShowBalanceAndPrice: async () => {},
    setSidePanelPreferred: async () => {},
  } as unknown as SettingsStore,
  zondStore: {
    activeAccount: {
      accountAddress: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
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
    qrlInstance: undefined,
    fetchAccounts: async () => {},
    fetchZondConnection: async () => {},
    getAccountBalance: (accountAddress: string) => {
      accountAddress;
      return "0.0 QRL";
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
        maxPriorityFeePerGas: BigInt(0),
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
    signAndSendReplacementTransaction: async () => ({
      transactionHash: undefined,
      rawTransaction: undefined,
      error: "",
    }),
    getTransactionReceipt: async () => null,
    sendRawTransaction: async () => undefined,
    refreshBlockchainData: async () => {},
    addChain: async (chainData: BlockchainDataType) => {
      chainData;
      return { chainFound: false, updatedChainList: [] };
    },
    editChain: async (chainData: BlockchainDataType) => {
      chainData;
      return { updatedChainList: [] };
    },
  } as unknown as ZondStore,
  dAppRequestStore: {
    dAppRequestData: {
      method: "qrl_requestAccounts",
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
    initialize: () => {},
    lock: async () => {},
    initializeStorageListener: () => {},
    getWalletPassword: async () => {
      return "";
    },
    getMnemonicPhrases: async (accountAddress: string) => {
      return accountAddress;
    },
    changePassword: async () => {
      return true;
    },
  } as unknown as LockStore,
  ledgerStore: {
    connectionState: "disconnected",
    deviceInfo: null,
    connectionError: "",
    accounts: [],
    isLoadingAccounts: false,
    signingState: "idle",
    signingStatus: null,
    signResult: null,
    isConnected: false,
    isConnecting: false,
    hasError: false,
    hasAccounts: false,
    isSigning: false,
    isAwaitingConfirmation: false,
    connect: async () => {},
    disconnect: async () => {},
    loadAccounts: async () => {},
    fetchPageAccounts: async () => {},
    addAccount: async () => ({
      address: "",
      derivationPath: "",
      publicKey: "",
      index: 0,
    }),
    removeAccount: async () => {},
    verifyAddress: async () => true,
    signTransaction: async () => ({ success: false }),
    signAndSerializeTransaction: async () => "0x",
    fetchPublicKey: async () => ({ publicKey: "" }),
    clearSigningState: () => {},
    clearError: () => {},
    isLedgerAccount: () => false,
    getAccountByAddress: () => undefined,
  } as any,
  transactionHistoryStore: {
    transactions: [],
    isLoading: false,
    filter: "all" as const,
    filteredTransactions: [],
    pendingTransactions: [],
    loadHistory: async (accountAddress: string, _qrlInstance?: any) => {
      accountAddress;
    },
    addTransaction: async (accountAddress: string, entry: any) => {
      accountAddress;
      entry;
    },
    updateTransaction: async (
      accountAddress: string,
      transactionHash: string,
      updates: any,
    ) => {
      accountAddress;
      transactionHash;
      updates;
    },
    setFilter: (filter: string) => {
      filter;
    },
    clearHistory: async (accountAddress: string) => {
      accountAddress;
    },
    startPolling: (accountAddress: string, _qrlInstance: any) => {
      accountAddress;
    },
    stopPolling: () => {},
  } as any,
  contactsStore: {
    contacts: [],
    isLoading: false,
    loadContacts: async () => {},
    addContact: async () => {},
    removeContact: async () => {},
    updateContact: async () => {},
    getContactByAddress: () => undefined,
  },
  accountLabelsStore: {
    labels: {},
    isLoading: false,
    loadLabels: async () => {},
    syncLabels: async () => {},
    setLabel: async () => {},
    getLabel: () => "",
    clearLabels: async () => {},
  },
  priceStore: {
    prices: {},
    change24h: {},
    lastUpdated: 0,
    isLoading: false,
    hasError: false,
    getPrice: () => 0,
    isCacheStale: false,
    initialize: async () => {},
    fetchPrices: async () => {},
    startAutoRefresh: () => {},
    stopAutoRefresh: () => {},
    getChange24h: () => 0,
  } as any,
};

export const mockedStore = (
  overrideStoreValues: PartialDeep<StoreType> = {},
) => {
  return deepmerge(mockedStoreValues, overrideStoreValues) as StoreType;
};
const StoreContext = createContext(mockedStore);
export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;

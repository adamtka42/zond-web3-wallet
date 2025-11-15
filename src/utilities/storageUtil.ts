import {
  BlockchainDataType,
  DEFAULT_BLOCKCHAIN,
  ZOND_BLOCKCHAINS,
} from "@/configuration/zondBlockchainConfig";
import {
  ConnectedAccountsDataType,
  DAppRequestType,
  TokenContractType,
} from "@/scripts/middlewares/middlewareTypes";
import { KeyStore } from "@theqrl/web3";
import browser from "webextension-polyfill";

const KEYSTORES_IDENTIFIER = "KEYSTORES";

const ACCOUNTS_IDENTIFIER = "ACCOUNTS";
const ALL_ACCOUNTS_IDENTIFIER = "ALL_ACCOUNTS";
const ACTIVE_ACCOUNT_IDENTIFIER = "ACTIVE_ACCOUNT";

const BLOCKCHAINS_IDENTIFIER = "BLOCKCHAINS";
const ALL_BLOCKCHAINS_IDENTIFIER = "ALL_BLOCKCHAINS";
const ACTIVE_BLOCKCHAIN_IDENTIFIER = "ACTIVE_BLOCKCHAIN";

const DAPPS_IDENTIFIER = "DAPPS";
const ALL_DAPPS_IDENTIFIER = "ALL_DAPPS";
const DAPPS_REQUEST_DATA_IDENTIFIER = "DAPPS_REQUEST_DATA";

const TOKENS_IDENTIFIER = "TOKENS";
const ALL_TOKENS_IDENTIFIER = "ALL_TOKENS";

const ACTIVE_PAGE_IDENTIFIER = "ACTIVE_PAGE";

const TRANSACTION_VALUES_IDENTIFIER = "TRANSACTION_VALUES";

type TransactionValuesType = {
  receiverAddress?: string;
  amount?: number;
  tokenDetails?: {
    isZrc20Token: boolean;
    tokenContractAddress: string;
    tokenDecimals: number;
    tokenImage: string;
    tokenBalance: string;
    tokenName: string;
    tokenSymbol: string;
  };
};

export const LockState = Object.freeze({
  LOCKED: "LOCKED",
  UNLOCKED: "UNLOCKED",
});

type LockStateType = (typeof LockState)[keyof typeof LockState];

/**
 * A utility for storing and retrieving states of different components to and from the browser storage.
 */
class StorageUtil {
  /**
   * A function for storing the keystore data.
   * Call the getKeystore function to retrieve the stored value, and clearKeystore for clearing the stored value.
   */
  static async setKeystores(keystores: KeyStore[]) {
    await browser.storage.local.set({
      [KEYSTORES_IDENTIFIER]: JSON.stringify(keystores),
    });
  }

  static async getKeystores() {
    const storageData = await browser.storage.local.get(KEYSTORES_IDENTIFIER);
    const keyStores = storageData?.[KEYSTORES_IDENTIFIER];
    return (keyStores ? JSON.parse(keyStores) : []) as KeyStore[];
  }

  static async clearKeystores() {
    await browser.storage.local.remove(KEYSTORES_IDENTIFIER);
  }

  static async updateLockStateTimeStamp(lockState: LockStateType) {
    const lockStatusIdentifier = `LOCK_MANAGER_${lockState}_TIMESTAMP`;
    await browser.storage.local.set({
      [lockStatusIdentifier]: Date.now(),
    });
  }

  /**
   * A function for storing the transaction state values, so that the user need not fill in the field values if the extension is closed and opened again.
   * Call the getTransactionValues fuction to retieve the stored value.
   */
  static async setTransactionValues(transactionValues: TransactionValuesType) {
    const { chainId } = await this.getActiveBlockChain();
    const transactionValuesIdentifier = `${chainId}_${TRANSACTION_VALUES_IDENTIFIER}`;
    const transactionValuesWithDefaultValues = {
      receiverAddress: transactionValues.receiverAddress ?? "",
      amount: transactionValues.amount ?? 0,
      tokenDetails: transactionValues.tokenDetails,
    };
    await browser.storage.local.set({
      [transactionValuesIdentifier]: transactionValuesWithDefaultValues,
    });
  }

  static async getTransactionValues() {
    const { chainId } = await this.getActiveBlockChain();
    const transactionValuesIdentifier = `${chainId}_${TRANSACTION_VALUES_IDENTIFIER}`;
    let transactionValues: TransactionValuesType = {
      receiverAddress: "",
      amount: 0,
    };

    const storedTransactionValues = await browser.storage.local.get(
      transactionValuesIdentifier,
    );
    if (storedTransactionValues) {
      transactionValues = {
        ...transactionValues,
        ...storedTransactionValues[transactionValuesIdentifier],
      };
    }

    return transactionValues;
  }

  static async clearTransactionValues() {
    const { chainId } = await this.getActiveBlockChain();
    const transactionValuesIdentifier = `${chainId}_${TRANSACTION_VALUES_IDENTIFIER}`;
    await browser.storage.local.remove(transactionValuesIdentifier);
  }

  /**
   * A function for storing the accounts created and imported within the zond web3 wallet extension.
   * Call the getAllAccounts function to retrieve the stored value.
   */
  static async setAllAccounts(accountList: string[]) {
    const existing = (await browser.storage.local.get(ACCOUNTS_IDENTIFIER))?.[
      ACCOUNTS_IDENTIFIER
    ];
    await browser.storage.local.set({
      [ACCOUNTS_IDENTIFIER]: {
        ...existing,
        [ALL_ACCOUNTS_IDENTIFIER]: accountList,
      },
    });
  }

  static async getAllAccounts() {
    const storedAllAccounts = (
      await browser.storage.local.get(ACCOUNTS_IDENTIFIER)
    )?.[ACCOUNTS_IDENTIFIER];
    return (storedAllAccounts?.[ALL_ACCOUNTS_IDENTIFIER] ?? []) as string[];
  }

  /**
   * A function for storing the active account in the wallet.
   * Call the getActiveAccount function to retrieve the stored value, and clearActiveAccount for clearing the stored value.
   */
  static async setActiveAccount(activeAccount?: string) {
    if (activeAccount) {
      const existing = (await browser.storage.local.get(ACCOUNTS_IDENTIFIER))?.[
        ACCOUNTS_IDENTIFIER
      ];
      await browser.storage.local.set({
        [ACCOUNTS_IDENTIFIER]: {
          ...existing,
          [ACTIVE_ACCOUNT_IDENTIFIER]: activeAccount ?? "",
        },
      });
    } else {
      await this.clearActiveAccount();
    }
  }

  static async getActiveAccount() {
    const storedAccounts = (
      await browser.storage.local.get(ACCOUNTS_IDENTIFIER)
    )?.[ACCOUNTS_IDENTIFIER];
    return (storedAccounts?.[ACTIVE_ACCOUNT_IDENTIFIER] ?? "") as string;
  }

  static async clearActiveAccount() {
    const storedAccounts =
      (await browser.storage.local.get(ACCOUNTS_IDENTIFIER))?.[
        ACCOUNTS_IDENTIFIER
      ] ?? {};
    delete storedAccounts?.[ACTIVE_ACCOUNT_IDENTIFIER];
    await browser.storage.local.set({
      [ACCOUNTS_IDENTIFIER]: storedAccounts,
    });
  }

  /**
   * A function for storing all the available blockchains.
   * Call the getAllBlockChains function to retrieve all the stored blockchains.
   */
  static async setAllBlockChains(blockchains: BlockchainDataType[]) {
    const existing = (
      await browser.storage.local.get(BLOCKCHAINS_IDENTIFIER)
    )?.[BLOCKCHAINS_IDENTIFIER];
    await browser.storage.local.set({
      [BLOCKCHAINS_IDENTIFIER]: {
        ...existing,
        [ALL_BLOCKCHAINS_IDENTIFIER]: blockchains,
      },
    });
  }

  static async getAllBlockChains() {
    const storedBlockchains = (
      await browser.storage.local.get(BLOCKCHAINS_IDENTIFIER)
    )?.[BLOCKCHAINS_IDENTIFIER];
    return (storedBlockchains?.[ALL_BLOCKCHAINS_IDENTIFIER] ??
      ZOND_BLOCKCHAINS) as BlockchainDataType[];
  }

  /**
   * A function for storing the blockchain selection.
   * Call the getActiveBlockChain function to retrieve the stored value.
   */
  static async setActiveBlockChain(selectedBlockchainId: string) {
    const existing = (
      await browser.storage.local.get(BLOCKCHAINS_IDENTIFIER)
    )?.[BLOCKCHAINS_IDENTIFIER];
    await browser.storage.local.set({
      [BLOCKCHAINS_IDENTIFIER]: {
        ...existing,
        [ACTIVE_BLOCKCHAIN_IDENTIFIER]: selectedBlockchainId,
      },
    });
  }

  static async getActiveBlockChain() {
    const storedBlockchains = (
      await browser.storage.local.get(BLOCKCHAINS_IDENTIFIER)
    )?.[BLOCKCHAINS_IDENTIFIER];
    const blockchains = await this.getAllBlockChains();
    const existingChain = blockchains.find(
      (chain) =>
        chain.chainId.toLowerCase() ===
        storedBlockchains?.[ACTIVE_BLOCKCHAIN_IDENTIFIER]?.toLowerCase(),
    );
    return existingChain ?? DEFAULT_BLOCKCHAIN;
  }

  /**
   * A function for storing the route to be displayed on opening the extension.
   * Call the getActivePage function to retrieve the stored value, and clearActivePage for clearing the stored value.
   */
  static async setActivePage(activePage: string) {
    if (activePage) {
      await browser.storage.local.set({ [ACTIVE_PAGE_IDENTIFIER]: activePage });
    } else {
      await browser.storage.local.remove(ACTIVE_PAGE_IDENTIFIER);
    }
  }

  static async getActivePage() {
    const storedActivePage = await browser.storage.local.get(
      ACTIVE_PAGE_IDENTIFIER,
    );
    return (storedActivePage?.[ACTIVE_PAGE_IDENTIFIER] ?? "") as string;
  }

  static async clearActivePage() {
    await browser.storage.local.remove(ACTIVE_PAGE_IDENTIFIER);
  }

  /**
   * A function for storing the list of imported tokens.
   * Call the getTokenContractsList function to retrieve the stored value, and clearFromTokenList for clearing the stored value.
   */
  static async setTokenContractsList(
    accountAddress: string,
    tokenContract: TokenContractType,
  ) {
    const { chainId } = await this.getActiveBlockChain();

    const storageData = await browser.storage.local.get(TOKENS_IDENTIFIER);
    if (!storageData[TOKENS_IDENTIFIER]) {
      storageData[TOKENS_IDENTIFIER] = {};
    }
    if (!storageData[TOKENS_IDENTIFIER][ALL_TOKENS_IDENTIFIER]) {
      storageData[TOKENS_IDENTIFIER][ALL_TOKENS_IDENTIFIER] = {};
    }
    if (
      !storageData[TOKENS_IDENTIFIER][ALL_TOKENS_IDENTIFIER][accountAddress]
    ) {
      storageData[TOKENS_IDENTIFIER][ALL_TOKENS_IDENTIFIER][accountAddress] =
        {};
    }
    if (
      !storageData[TOKENS_IDENTIFIER][ALL_TOKENS_IDENTIFIER][accountAddress][
        chainId
      ]
    ) {
      storageData[TOKENS_IDENTIFIER][ALL_TOKENS_IDENTIFIER][accountAddress][
        chainId
      ] = {};
    }
    const storedTokenContracts =
      await this.getTokenContractsList(accountAddress);
    storageData[TOKENS_IDENTIFIER][ALL_TOKENS_IDENTIFIER][accountAddress][
      chainId
    ].tokens = [
      ...storedTokenContracts?.filter(
        (token) => token.address !== tokenContract.address,
      ),
      tokenContract,
    ];

    await browser.storage.local.set(storageData);
  }

  static async getTokenContractsList(accountAddress: string) {
    const { chainId } = await this.getActiveBlockChain();

    const storageData = await browser.storage.local.get(TOKENS_IDENTIFIER);
    const storedTokenContracts =
      storageData?.[TOKENS_IDENTIFIER]?.[ALL_TOKENS_IDENTIFIER]?.[
        accountAddress
      ]?.[chainId]?.tokens ?? [];

    return storedTokenContracts as TokenContractType[];
  }

  static async clearFromTokenContractsList(
    accountAddress: string,
    contractAddress: string,
  ) {
    const { chainId } = await this.getActiveBlockChain();

    const storageData = await browser.storage.local.get(TOKENS_IDENTIFIER);
    const storedTokenContracts =
      await this.getTokenContractsList(accountAddress);
    storageData[TOKENS_IDENTIFIER][ALL_TOKENS_IDENTIFIER][accountAddress][
      chainId
    ].tokens = storedTokenContracts.filter(
      (token) => token.address !== contractAddress,
    );

    await browser.storage.local.set({ ...storageData });
  }

  /**
   * A function for storing the request info temporarily by the dApp, which will be read by the zond web3 wallet.
   * Call the getDAppsRequestData function to retrieve the stored value, and clearDAppsRequestData for clearing the stored value.
   */
  static async setDAppsRequestData(dAppsRequestData: DAppRequestType) {
    await browser.storage.session.set({
      [DAPPS_IDENTIFIER]: {
        [DAPPS_REQUEST_DATA_IDENTIFIER]: dAppsRequestData,
      },
    });
  }

  static async getDAppsRequestData() {
    const storedDAppsRequestData = (
      await browser.storage.session.get(DAPPS_IDENTIFIER)
    )?.[DAPPS_IDENTIFIER];
    return storedDAppsRequestData?.[DAPPS_REQUEST_DATA_IDENTIFIER] as
      | DAppRequestType
      | undefined;
  }

  static async clearDAppsRequestData() {
    const storedDAppsRequestData =
      (await browser.storage.session.get(DAPPS_IDENTIFIER))?.[
        DAPPS_IDENTIFIER
      ] ?? {};
    delete storedDAppsRequestData?.[DAPPS_REQUEST_DATA_IDENTIFIER];
    await browser.storage.session.set({
      [DAPPS_IDENTIFIER]: storedDAppsRequestData,
    });
  }

  /**
   * A function for storing the connected accounts info temporarily, which will be read by method like 'zond_accounts'.
   * Call the getDAppsConnectedAccountsData function to retrieve the stored value, and clearDAppsConnectedAccountsData for clearing the stored value.
   */
  static async setDAppsConnectedAccountsData(data: ConnectedAccountsDataType) {
    const urlOrigin = data.urlOrigin;

    const storageData = await browser.storage.local.get(DAPPS_IDENTIFIER);
    if (!storageData[DAPPS_IDENTIFIER]) {
      storageData[DAPPS_IDENTIFIER] = {};
    }
    if (!storageData[DAPPS_IDENTIFIER][ALL_DAPPS_IDENTIFIER]) {
      storageData[DAPPS_IDENTIFIER][ALL_DAPPS_IDENTIFIER] = {};
    }
    if (!storageData[DAPPS_IDENTIFIER][ALL_DAPPS_IDENTIFIER][urlOrigin]) {
      storageData[DAPPS_IDENTIFIER][ALL_DAPPS_IDENTIFIER][urlOrigin] = {};
    }
    storageData[DAPPS_IDENTIFIER][ALL_DAPPS_IDENTIFIER][urlOrigin].urlOrigin =
      urlOrigin;
    storageData[DAPPS_IDENTIFIER][ALL_DAPPS_IDENTIFIER][urlOrigin].accounts =
      data.accounts;
    storageData[DAPPS_IDENTIFIER][ALL_DAPPS_IDENTIFIER][urlOrigin].blockchains =
      data.blockchains;
    storageData[DAPPS_IDENTIFIER][ALL_DAPPS_IDENTIFIER][urlOrigin].permissions =
      data.permissions;

    await browser.storage.local.set(storageData);
  }

  static async getDAppsConnectedAccountsData(urlOrigin: string = "") {
    const storageData = await browser.storage.local.get(DAPPS_IDENTIFIER);
    return storageData?.[DAPPS_IDENTIFIER]?.[ALL_DAPPS_IDENTIFIER]?.[
      urlOrigin
    ] as ConnectedAccountsDataType | undefined;
  }

  static async clearDAppsConnectedAccountsData(urlOrigin: string = "") {
    const storageData = await browser.storage.local.get(DAPPS_IDENTIFIER);
    delete storageData[DAPPS_IDENTIFIER]?.[ALL_DAPPS_IDENTIFIER]?.[urlOrigin];
    await browser.storage.local.set(storageData);
  }

  static async clearAllData() {
    await browser.storage.local.clear();
  }
}

export default StorageUtil;

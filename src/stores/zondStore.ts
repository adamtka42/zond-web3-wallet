import {
  BlockchainDataType,
  DEFAULT_BLOCKCHAIN,
} from "@/configuration/zondBlockchainConfig";
import { NATIVE_TOKEN_UNITS_OF_GAS } from "@/constants/nativeToken";
import {
  ZRC_20_CONTRACT_ABI,
  ZRC_20_TOKEN_UNITS_OF_GAS,
} from "@/constants/zrc20Token";
import { getHexSeedFromMnemonic } from "@/functions/getHexSeedFromMnemonic";
import { getOptimalTokenBalance } from "@/functions/getOptimalTokenBalance";
import type { GasFeeOverrides } from "@/types/gasFee";
import type { TransactionHistoryEntry } from "@/types/transactionHistory";
import StorageUtil from "@/utilities/storageUtil";
import Web3, {
  TransactionReceipt,
  Web3QRLInterface,
  utils,
} from "@theqrl/web3";
import { action, makeAutoObservable, observable, runInAction } from "mobx";

type ActiveAccountType = {
  accountAddress: string;
};

type ZondAccountType = {
  accountAddress: string;
  accountBalance: string;
};

type ZondAccountsType = {
  accounts: ZondAccountType[];
  isLoading: boolean;
};

class ZondStore {
  qrlInstance?: Web3QRLInterface;
  zondConnection = {
    isConnected: false,
    isLoading: false,
    blockchain: DEFAULT_BLOCKCHAIN,
  };
  zondAccounts: ZondAccountsType = { accounts: [], isLoading: false };
  activeAccount: ActiveAccountType = { accountAddress: "" };

  constructor() {
    makeAutoObservable(this, {
      initializeBlockchain: action.bound,
      qrlInstance: observable.struct,
      zondConnection: observable.struct,
      zondAccounts: observable.struct,
      activeAccount: observable.struct,
      refreshBlockchainData: action.bound,
      selectBlockchain: action.bound,
      setActiveAccount: action.bound,
      fetchZondConnection: action.bound,
      fetchAccounts: action.bound,
      getGasFeeData: action.bound,
      getAccountBalance: action.bound,
      getNativeTokenGas: action.bound,
      signAndSendNativeToken: action.bound,
      getZrc20TokenDetails: action.bound,
      getZrc20TokenGas: action.bound,
      signAndSendZrc20Token: action.bound,
      signAndSendReplacementTransaction: action.bound,
      getTransactionReceipt: action.bound,
      sendRawTransaction: action.bound,
    });
    this.initializeBlockchain();
  }

  async initializeBlockchain() {
    await this.refreshBlockchainData();
    const zondHttpProvider = new Web3.providers.HttpProvider(
      this.zondConnection.blockchain.defaultRpcUrl || "http://localhost",
    );
    const { qrl } = new Web3({ provider: zondHttpProvider });
    this.qrlInstance = qrl;

    await this.fetchZondConnection();
    await this.fetchAccounts();
    await this.validateActiveAccount();
  }

  async addChain(chainData: BlockchainDataType) {
    const newChain: BlockchainDataType = {
      ...chainData,
      chainId: chainData?.chainId?.trim(),
      chainName: chainData?.chainName?.trim()?.substring(0, 100),
    };
    const blockchains = await StorageUtil.getAllBlockChains();
    const chainFound = !!blockchains.find(
      (chain) => chain.chainId.toLowerCase() === newChain.chainId.toLowerCase(),
    );
    return { chainFound, updatedChainList: [...blockchains, newChain] };
  }

  async editChain(chainData: BlockchainDataType) {
    const editedChain = {
      ...chainData,
      chainId: chainData?.chainId?.trim(),
      chainName: chainData?.chainName?.trim()?.substring(0, 100),
    };
    const blockchains = await StorageUtil.getAllBlockChains();
    const updatedChainList: BlockchainDataType[] = blockchains.map((chain) =>
      chain.chainId.toLowerCase() === editedChain?.chainId?.toLowerCase()
        ? { ...chain, ...editedChain }
        : chain,
    );
    return { updatedChainList };
  }

  async refreshBlockchainData() {
    const blockchain = await StorageUtil.getActiveBlockChain();
    this.zondConnection = { ...this.zondConnection, blockchain };
  }

  async selectBlockchain(chainId: string) {
    await StorageUtil.setActiveBlockChain(chainId);
    await this.initializeBlockchain();
  }

  async setActiveAccount(activeAccount?: string) {
    await StorageUtil.setActiveAccount(activeAccount);
    this.activeAccount = {
      ...this.activeAccount,
      accountAddress: activeAccount ?? "",
    };

    let storedAccountList: string[] = [];
    try {
      const accountListFromStorage = await StorageUtil.getAllAccounts();
      storedAccountList = [...accountListFromStorage];
      if (activeAccount) {
        storedAccountList.push(activeAccount);
      }
      storedAccountList = [...new Set(storedAccountList)];
    } finally {
      await StorageUtil.setAllAccounts(storedAccountList);
      await this.fetchAccounts();
    }
  }

  async fetchZondConnection() {
    this.zondConnection = { ...this.zondConnection, isLoading: true };
    try {
      const isListening = (await this.qrlInstance?.net.isListening()) ?? false;
      runInAction(() => {
        this.zondConnection = {
          ...this.zondConnection,
          isConnected: isListening,
        };
      });
    } catch (error) {
      runInAction(() => {
        this.zondConnection = { ...this.zondConnection, isConnected: false };
      });
    } finally {
      runInAction(() => {
        this.zondConnection = { ...this.zondConnection, isLoading: false };
      });
    }
  }

  async fetchAccounts() {
    this.zondAccounts = { ...this.zondAccounts, isLoading: true };

    let storedAccountsList: string[] = [];
    const accountListFromStorage = await StorageUtil.getAllAccounts();
    storedAccountsList = accountListFromStorage;
    try {
      const accountsWithBalance: ZondAccountsType["accounts"] =
        await Promise.all(
          storedAccountsList.map(async (account) => {
            const accountBalance =
              (await this.qrlInstance?.getBalance(account)) ?? BigInt(0);
            const convertedAccountBalance = getOptimalTokenBalance(
              utils.fromPlanck(accountBalance, "quanta"),
            );
            return {
              accountAddress: account,
              accountBalance: convertedAccountBalance,
            };
          }),
        );
      runInAction(() => {
        this.zondAccounts = {
          ...this.zondAccounts,
          accounts: accountsWithBalance,
        };
      });
    } catch (error) {
      runInAction(() => {
        this.zondAccounts = {
          ...this.zondAccounts,
          accounts: storedAccountsList.map((account) => ({
            accountAddress: account,
            accountBalance: "0.0 QRL",
          })),
        };
      });
    } finally {
      runInAction(() => {
        this.zondAccounts = { ...this.zondAccounts, isLoading: false };
      });
    }
  }

  async validateActiveAccount() {
    this.activeAccount = { accountAddress: "" };
    const storedActiveAccount = await StorageUtil.getActiveAccount();

    const confirmedExistingActiveAccount =
      this.zondAccounts.accounts.find(
        (account) => account.accountAddress === storedActiveAccount,
      )?.accountAddress ?? "";
    if (!confirmedExistingActiveAccount) {
      await StorageUtil.clearActiveAccount();
    }
    runInAction(() => {
      this.activeAccount = {
        ...this.activeAccount,
        accountAddress: confirmedExistingActiveAccount,
      };
    });
  }

  private async getBaseTip(): Promise<bigint> {
    try {
      const tip = await (this.qrlInstance as any)?.requestManager?.send({
        method: "qrl_maxPriorityFeePerGas",
        params: [],
      });
      const parsed = BigInt(tip);
      if (parsed > BigInt(0)) return parsed;
    } catch {
      // RPC method not supported — fall back to default
    }
    return BigInt(utils.toPlanck("2", "shor"));
  }

  async getGasFeeData(overrides?: GasFeeOverrides) {
    const latestBlock = await this.qrlInstance?.getBlock("latest");
    const baseFeePerGas = latestBlock?.baseFeePerGas ?? BigInt(0);

    if (overrides?.tier === "advanced") {
      const maxPriorityFeePerGas =
        overrides.maxPriorityFeePerGas ?? BigInt(0);
      const maxFeePerGas =
        overrides.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
      return { baseFeePerGas, maxPriorityFeePerGas, maxFeePerGas };
    }

    const baseTip = await this.getBaseTip();
    let maxPriorityFeePerGas: bigint;

    switch (overrides?.tier) {
      case "low":
        maxPriorityFeePerGas = baseTip;
        break;
      case "aggressive":
        maxPriorityFeePerGas = baseTip * BigInt(2);
        break;
      case "market":
      default:
        // 1.5x — multiply by 3 then divide by 2, rounded up
        maxPriorityFeePerGas = (baseTip * BigInt(3) + BigInt(1)) / BigInt(2);
        break;
    }

    const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas;
    return { baseFeePerGas, maxPriorityFeePerGas, maxFeePerGas };
  }

  getAccountBalance(accountAddress: string) {
    return (
      this.zondAccounts.accounts.find(
        (account) => account.accountAddress === accountAddress,
      )?.accountBalance ?? "0.0 QRL"
    );
  }

  async getNativeTokenGas(overrides?: GasFeeOverrides) {
    const gasLimit =
      overrides?.tier === "advanced" && overrides.gasLimit
        ? overrides.gasLimit
        : NATIVE_TOKEN_UNITS_OF_GAS;
    const { baseFeePerGas, maxPriorityFeePerGas } =
      await this.getGasFeeData(overrides);
    return utils.fromPlanck(
      BigInt(gasLimit) * (baseFeePerGas + maxPriorityFeePerGas),
      "quanta",
    );
  }

  async signAndSendNativeToken(
    from: string,
    to: string,
    value: number,
    mnemonicPhrases: string,
    overrides?: GasFeeOverrides,
  ) {
    let transaction: {
      transactionReceipt?: TransactionReceipt;
      error: string;
      nonce?: number;
      maxFeePerGas?: string;
      maxPriorityFeePerGas?: string;
      gasLimit?: number;
    } = { transactionReceipt: undefined, error: "" };

    try {
      const { maxFeePerGas, maxPriorityFeePerGas } =
        await this.getGasFeeData(overrides);
      const gasLimit =
        overrides?.tier === "advanced" && overrides.gasLimit
          ? overrides.gasLimit
          : NATIVE_TOKEN_UNITS_OF_GAS;
      const nonce = await this.qrlInstance?.getTransactionCount(from);
      const transactionObject = {
        from,
        to,
        value: utils.toPlanck(value, "quanta"),
        nonce,
        gasLimit,
        maxFeePerGas: Number(maxFeePerGas),
        maxPriorityFeePerGas: Number(maxPriorityFeePerGas),
        type: 2,
      };
      const signedTransaction =
        await this.qrlInstance?.accounts.signTransaction(
          transactionObject,
          getHexSeedFromMnemonic(mnemonicPhrases),
        );
      if (signedTransaction) {
        const transactionReceipt =
          await this.qrlInstance?.sendSignedTransaction(
            signedTransaction?.rawTransaction,
          );
        transaction = {
          ...transaction,
          transactionReceipt,
          nonce: Number(nonce),
          maxFeePerGas: maxFeePerGas.toString(),
          maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
          gasLimit,
        };
      } else {
        throw new Error("Transaction could not be signed");
      }
    } catch (error) {
      transaction = {
        ...transaction,
        error: `Transaction could not be completed. ${error}`,
      };
    }

    return transaction;
  }

  async getZrc20TokenDetails(contractAddress: string) {
    let tokenDetails = {
      token: undefined,
      error: "",
    };

    const contractAbi = ZRC_20_CONTRACT_ABI;

    if (this.qrlInstance && this.qrlInstance.Contract) {
      try {
        const contract = new this.qrlInstance.Contract(
          contractAbi,
          contractAddress,
        );
        const name = (await contract.methods.name().call()) as string;
        const symbol = (await contract.methods.symbol().call()) as string;
        const decimals = (await contract.methods.decimals().call()) as bigint;
        const totalSupplyUnformatted = (await contract.methods
          .totalSupply()
          .call()) as bigint;
        const totalSupply =
          Number(totalSupplyUnformatted) / Math.pow(10, Number(decimals));
        const balanceUnformatted = (await contract.methods
          .balanceOf(this.activeAccount.accountAddress)
          .call()) as bigint;
        const balance =
          Number(balanceUnformatted) / Math.pow(10, Number(decimals));
        return {
          ...tokenDetails,
          token: { name, symbol, decimals, totalSupply, balance, image: "" },
        };
      } catch (error) {
        return {
          ...tokenDetails,
          error:
            "Could not retreive the token with the entered contract address",
        };
      }
    }

    return tokenDetails;
  }

  async getZrc20TokenGas(
    from: string,
    to: string,
    value: number,
    contractAddress: string,
    decimals: number,
    overrides?: GasFeeOverrides,
  ) {
    if (this.qrlInstance && this.qrlInstance.Contract) {
      const contract = new this.qrlInstance.Contract(
        ZRC_20_CONTRACT_ABI,
        contractAddress,
      );
      const contractTransfer = contract.methods.transfer(
        to,
        BigInt(value * 10 ** decimals),
      );
      const estimatedGasLimit = Number(
        await contractTransfer.estimateGas({ from }),
      );
      const gasLimit =
        overrides?.tier === "advanced" && overrides.gasLimit
          ? overrides.gasLimit
          : estimatedGasLimit;
      const { baseFeePerGas, maxPriorityFeePerGas } =
        await this.getGasFeeData(overrides);
      return utils.fromPlanck(
        BigInt(gasLimit) * (baseFeePerGas + maxPriorityFeePerGas),
        "quanta",
      );
    }
    return "";
  }

  async signAndSendZrc20Token(
    from: string,
    to: string,
    value: number,
    mnemonicPhrases: string,
    contractAddress: string,
    decimals: number,
    overrides?: GasFeeOverrides,
  ) {
    let transaction: {
      transactionReceipt?: TransactionReceipt;
      error: string;
      nonce?: number;
      maxFeePerGas?: string;
      maxPriorityFeePerGas?: string;
      gasLimit?: number;
      data?: string;
    } = { transactionReceipt: undefined, error: "" };

    const contractAbi = ZRC_20_CONTRACT_ABI;

    if (this.qrlInstance && this.qrlInstance.Contract) {
      try {
        this.qrlInstance.wallet?.add(getHexSeedFromMnemonic(mnemonicPhrases));
        this.qrlInstance.transactionConfirmationBlocks = 12;
        const contract = new this.qrlInstance.Contract(
          contractAbi,
          contractAddress,
        );
        const contractTransfer = contract.methods.transfer(
          to,
          BigInt(value * 10 ** decimals),
        );
        const { maxFeePerGas, maxPriorityFeePerGas } =
          await this.getGasFeeData(overrides);
        const gasLimit =
          overrides?.tier === "advanced" && overrides.gasLimit
            ? overrides.gasLimit
            : ZRC_20_TOKEN_UNITS_OF_GAS;
        const nonce = await this.qrlInstance?.getTransactionCount(from);
        const encodedData = contractTransfer.encodeABI();
        const transactionObject = {
          from,
          to: contractAddress,
          data: encodedData,
          nonce,
          gasLimit,
          maxFeePerGas: Number(maxFeePerGas),
          maxPriorityFeePerGas: Number(maxPriorityFeePerGas),
          type: 2,
        };

        const transactionReceipt = await this.qrlInstance.sendTransaction(
          transactionObject,
          undefined,
          {
            checkRevertBeforeSending: true,
          },
        );

        transaction = {
          ...transaction,
          transactionReceipt,
          nonce: Number(nonce),
          maxFeePerGas: maxFeePerGas.toString(),
          maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
          gasLimit,
          data: encodedData,
        };
      } catch (error) {
        transaction = {
          ...transaction,
          error: `Transaction could not be completed. ${error}`,
        };
      }
    }

    return transaction;
  }
  async signAndSendReplacementTransaction(
    originalTx: TransactionHistoryEntry,
    replacementAction: "speed-up" | "cancel",
    mnemonicPhrases: string,
    overrides?: GasFeeOverrides,
  ) {
    let result: {
      transactionHash?: string;
      rawTransaction?: string;
      error: string;
    } = { error: "" };

    try {
      const tier = overrides?.tier ?? "aggressive";
      const { maxFeePerGas: newMaxFee, maxPriorityFeePerGas: newPriorityFee } =
        await this.getGasFeeData({ ...overrides, tier });

      // Enforce ≥10% bump over original
      const origMaxFee = BigInt(originalTx.maxFeePerGas ?? "0");
      const origPriorityFee = BigInt(originalTx.maxPriorityFeePerGas ?? "0");
      const minBumpedMaxFee =
        origMaxFee + (origMaxFee * BigInt(10)) / BigInt(100);
      const minBumpedPriorityFee =
        origPriorityFee + (origPriorityFee * BigInt(10)) / BigInt(100);

      const finalMaxFee =
        newMaxFee > minBumpedMaxFee ? newMaxFee : minBumpedMaxFee;
      const finalPriorityFee =
        newPriorityFee > minBumpedPriorityFee
          ? newPriorityFee
          : minBumpedPriorityFee;

      const nonce = originalTx.nonce;
      if (nonce === undefined) {
        throw new Error("Original transaction nonce is not available");
      }

      let transactionObject;
      if (replacementAction === "cancel") {
        transactionObject = {
          from: originalTx.from,
          to: originalTx.from,
          value: "0",
          nonce,
          gasLimit: NATIVE_TOKEN_UNITS_OF_GAS,
          maxFeePerGas: Number(finalMaxFee),
          maxPriorityFeePerGas: Number(finalPriorityFee),
          type: 2,
        };
      } else {
        transactionObject = {
          from: originalTx.from,
          to: originalTx.isZrc20Token
            ? originalTx.tokenContractAddress
            : originalTx.to,
          value: originalTx.isZrc20Token
            ? "0"
            : utils.toPlanck(originalTx.amount, "quanta"),
          nonce,
          gasLimit:
            originalTx.gasLimit ??
            (originalTx.isZrc20Token
              ? ZRC_20_TOKEN_UNITS_OF_GAS
              : NATIVE_TOKEN_UNITS_OF_GAS),
          maxFeePerGas: Number(finalMaxFee),
          maxPriorityFeePerGas: Number(finalPriorityFee),
          type: 2,
          ...(originalTx.data && { data: originalTx.data }),
        };
      }

      const signedTransaction =
        await this.qrlInstance?.accounts.signTransaction(
          transactionObject,
          getHexSeedFromMnemonic(mnemonicPhrases),
        );

      if (!signedTransaction) {
        throw new Error("Replacement transaction could not be signed");
      }

      result = {
        transactionHash: signedTransaction.transactionHash?.toString(),
        rawTransaction: signedTransaction.rawTransaction?.toString(),
        error: "",
      };
    } catch (error) {
      result = { error: `Replacement transaction failed. ${error}` };
    }

    return result;
  }

  async getTransactionReceipt(txHash: string) {
    return await this.qrlInstance?.getTransactionReceipt(txHash);
  }

  async sendRawTransaction(rawTransaction: string) {
    const receipt =
      await this.qrlInstance?.sendSignedTransaction(rawTransaction);
    return receipt;
  }
}

export default ZondStore;

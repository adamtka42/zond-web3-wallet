import type {
  TokenFilter,
  TransactionHistoryEntry,
} from "@/types/transactionHistory";
import StorageUtil from "@/utilities/storageUtil";
import { action, makeAutoObservable, observable, runInAction } from "mobx";

class TransactionHistoryStore {
  transactions: TransactionHistoryEntry[] = [];
  isLoading = false;
  filter: TokenFilter = "all";

  constructor() {
    makeAutoObservable(this, {
      transactions: observable,
      isLoading: observable,
      filter: observable,
      loadHistory: action.bound,
      addTransaction: action.bound,
      setFilter: action.bound,
      clearHistory: action.bound,
    });
  }

  get filteredTransactions(): TransactionHistoryEntry[] {
    if (this.filter === "all") return this.transactions;
    if (this.filter === "native")
      return this.transactions.filter((tx) => !tx.isZrc20Token);
    return this.transactions.filter((tx) => tx.isZrc20Token);
  }

  async loadHistory(accountAddress: string) {
    this.isLoading = true;
    try {
      const history =
        await StorageUtil.getTransactionHistory(accountAddress);
      runInAction(() => {
        this.transactions = history;
      });
    } catch (error) {
      console.error("Failed to load transaction history:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async addTransaction(
    accountAddress: string,
    entry: TransactionHistoryEntry,
  ) {
    await StorageUtil.setTransactionHistoryEntry(accountAddress, entry);
    await this.loadHistory(accountAddress);
  }

  setFilter(filter: TokenFilter) {
    this.filter = filter;
  }

  async clearHistory(accountAddress: string) {
    await StorageUtil.clearTransactionHistory(accountAddress);
    runInAction(() => {
      this.transactions = [];
    });
  }
}

export default TransactionHistoryStore;

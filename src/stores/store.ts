import { createContext, useContext } from "react";
import DAppRequestStore from "./dAppRequestStore";
import LedgerStore from "./ledgerStore";
import LockStore from "./lockStore";
import SettingsStore from "./settingsStore";
import TransactionHistoryStore from "./transactionHistoryStore";
import ZondStore from "./zondStore";

class Store {
  lockStore;
  settingsStore;
  dAppRequestStore;
  zondStore;
  ledgerStore;
  transactionHistoryStore;

  constructor() {
    this.lockStore = new LockStore();
    this.settingsStore = new SettingsStore();
    this.dAppRequestStore = new DAppRequestStore();
    this.zondStore = new ZondStore();
    this.ledgerStore = new LedgerStore();
    this.transactionHistoryStore = new TransactionHistoryStore();
  }
}

export type StoreType = InstanceType<typeof Store>;
export const store = new Store();
const StoreContext = createContext(store);
export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;

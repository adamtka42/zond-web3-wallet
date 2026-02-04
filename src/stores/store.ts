import { createContext, useContext } from "react";
import DAppRequestStore from "./dAppRequestStore";
import SettingsStore from "./settingsStore";
import ZondStore from "./zondStore";
import LockStore from "./lockStore";
import LedgerStore from "./ledgerStore";

class Store {
  lockStore;
  settingsStore;
  dAppRequestStore;
  zondStore;
  ledgerStore;

  constructor() {
    this.lockStore = new LockStore();
    this.settingsStore = new SettingsStore();
    this.dAppRequestStore = new DAppRequestStore();
    this.zondStore = new ZondStore();
    this.ledgerStore = new LedgerStore();
  }
}

export type StoreType = InstanceType<typeof Store>;
export const store = new Store();
const StoreContext = createContext(store);
export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;

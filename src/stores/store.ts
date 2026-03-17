import { createContext, useContext } from "react";
import AccountLabelsStore from "./accountLabelsStore";
import HiddenAccountsStore from "./hiddenAccountsStore";
import ContactsStore from "./contactsStore";
import DAppRequestStore from "./dAppRequestStore";
import LedgerStore from "./ledgerStore";
import LockStore from "./lockStore";
import PriceStore from "./priceStore";
import SettingsStore from "./settingsStore";
import TransactionHistoryStore from "./transactionHistoryStore";
import QrlStore from "./qrlStore";

class Store {
  lockStore;
  settingsStore;
  dAppRequestStore;
  qrlStore;
  ledgerStore;
  transactionHistoryStore;
  contactsStore;
  accountLabelsStore;
  hiddenAccountsStore;
  priceStore;

  constructor() {
    this.lockStore = new LockStore();
    this.settingsStore = new SettingsStore();
    this.dAppRequestStore = new DAppRequestStore();
    this.qrlStore = new QrlStore();
    this.ledgerStore = new LedgerStore();
    this.transactionHistoryStore = new TransactionHistoryStore();
    this.contactsStore = new ContactsStore();
    this.accountLabelsStore = new AccountLabelsStore();
    this.hiddenAccountsStore = new HiddenAccountsStore();
    this.priceStore = new PriceStore();
    this.priceStore.initialize(this.settingsStore.showBalanceAndPrice);
  }
}

export type StoreType = InstanceType<typeof Store>;
export const store = new Store();
const StoreContext = createContext(store);
export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;

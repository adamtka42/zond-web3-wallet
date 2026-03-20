import type { Contact } from "@/types/contact";
import StorageUtil from "@/utilities/storageUtil";
import { action, makeAutoObservable, observable, runInAction } from "mobx";

class ContactsStore {
  contacts: Contact[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this, {
      contacts: observable,
      isLoading: observable,
      loadContacts: action.bound,
      addContact: action.bound,
      removeContact: action.bound,
      updateContact: action.bound,
    });
  }

  async loadContacts() {
    this.isLoading = true;
    try {
      const contacts = await StorageUtil.getContacts();
      runInAction(() => {
        this.contacts = contacts;
      });
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async addContact(contact: Contact) {
    const exists = this.contacts.some(
      (c) => c.address.toLowerCase() === contact.address.toLowerCase(),
    );
    if (exists) return;

    const updated = [...this.contacts, contact];
    await StorageUtil.setContacts(updated);
    runInAction(() => {
      this.contacts = updated;
    });
  }

  async removeContact(address: string) {
    const updated = this.contacts.filter(
      (c) => c.address.toLowerCase() !== address.toLowerCase(),
    );
    await StorageUtil.setContacts(updated);
    runInAction(() => {
      this.contacts = updated;
    });
  }

  async updateContact(originalAddress: string, updated: Contact) {
    const updatedList = this.contacts.map((c) =>
      c.address.toLowerCase() === originalAddress.toLowerCase() ? updated : c,
    );
    await StorageUtil.setContacts(updatedList);
    runInAction(() => {
      this.contacts = updatedList;
    });
  }

  getContactByAddress(address: string): Contact | undefined {
    return this.contacts.find(
      (c) => c.address.toLowerCase() === address.toLowerCase(),
    );
  }
}

export default ContactsStore;

import StorageUtil from "@/utilities/storageUtil";
import { Bytes } from "@theqrl/web3";
import { decrypt, encrypt } from "@theqrl/web3-qrl-accounts";
import { getMnemonicFromHexSeed } from "@/functions/getMnemonicFromHexSeed";

type MessageType = {
  name: string;
  data: any;
};

export type EncryptAccountType = {
  seed: Bytes;
  password: string;
};

export type DecryptedKeyType = {
  password: string;
  address: string;
  mnemonicPhrases: string;
};

export const LOCK_MANAGER_MESSAGES = {
  PORT: "LOCK_MANGER_PORT",
  IS_LOCK_MANAGER_READY: "IS_LOCK_MANAGER_READY",
  IS_LOCKED: "LOCK_MANAGER_IS_LOCKED",
  ENCRYPT_ACCOUNT: "ENCRYPT_ACCOUNT",
  LOCK: "LOCK_MANAGER_LOCK",
  UNLOCK: "LOCK_MANAGER_UNLOCK",
  LOCK_MANAGER_KEEP_LIVE: "LOCK_MANAGER_KEEP_LIVE",
  GET_DECRYPTED_KEYS: "GET_DECRYPTED_KEYS",
  GET_WALLET_PASSWORD: "GET_WALLET_PASSWORD",
  SET_DECRYPTED_KEYS: "SET_DECRYPTED_KEYS",
} as const;

/**
 * The lock manager, which is part of the extension service worker handles lock related data and functions.
 *
 * IMPORTANT: CPU-heavy cryptographic operations (decrypt / encrypt via scrypt)
 * are performed in the popup, NOT in the service worker.  The popup sends the
 * resulting keys to the SW via the SET_DECRYPTED_KEYS message so that the SW
 * only stores them in memory.  This avoids Chrome killing the SW mid-decrypt.
 */
class LockManager {
  private static decryptedKeys?: DecryptedKeyType[];

  static lock() {
    this.clearDecryptedKeys();
  }

  /**
   * Decrypt all keystores with the given password.
   * Called via a dedicated port connection so there is no message-channel
   * timeout — the port stays open as long as needed.
   * Returns true on success, false on wrong password or empty keystores.
   */
  static async unlock(password: string): Promise<boolean> {
    try {
      const keyStores = await StorageUtil.getKeystores();
      if (!keyStores.length) return false;
      const decryptedKeys: DecryptedKeyType[] = [];
      for (const keyStore of keyStores) {
        // Yield the event loop between decryptions so Chrome
        // doesn't consider the service worker unresponsive.
        await new Promise((r) => setTimeout(r, 0));
        const { address, seed } = await decrypt(keyStore, password);
        decryptedKeys.push({
          password,
          address,
          mnemonicPhrases: getMnemonicFromHexSeed(seed),
        });
      }
      this.setDecryptedKeys(
        Array.from(
          new Map(
            decryptedKeys.map((item) => [item.address.toLowerCase(), item]),
          ).values(),
        ),
      );
      return true;
    } catch {
      this.clearDecryptedKeys();
      return false;
    }
  }

  static async isLocked() {
    let hasPasswordSet = true;
    const keyStores = await StorageUtil.getKeystores();
    const accounts = await StorageUtil.getAllAccounts();
    if (!keyStores.length || !accounts.length) {
      // If the keystore or account is missing in the storage, either the password was not set
      // or the storage was manually deleted.
      await StorageUtil.clearAllData();
      this.clearDecryptedKeys();
      hasPasswordSet = false;
    }
    return {
      isLocked: this.decryptedKeys === undefined,
      hasPasswordSet,
    };
  }

  /**
   * Accept pre-decrypted keys from the popup.
   * The popup performs the CPU-heavy decrypt, then sends the results here.
   */
  static setDecryptedKeysFromPopup(keys: DecryptedKeyType[]) {
    this.setDecryptedKeys(
      Array.from(
        new Map(
          keys.map((item) => [item.address.toLowerCase(), item]),
        ).values(),
      ),
    );
  }

  static async encryptAccount(accountData: EncryptAccountType) {
    const { password, seed } = accountData;
    const keystores = await StorageUtil.getKeystores();
    const encryptedKeyStore = await encrypt(seed, password);
    const updatedKeyStores = [...keystores, encryptedKeyStore];
    await StorageUtil.setKeystores(
      Array.from(
        new Map(
          updatedKeyStores.map((item) => [item.address.toLowerCase(), item]),
        ).values(),
      ),
    );
    // Add the new account key directly to in-memory keys
    // instead of re-decrypting everything (which would block the SW).
    const newKey: DecryptedKeyType = {
      password,
      address: encryptedKeyStore.address,
      mnemonicPhrases: getMnemonicFromHexSeed(seed as string),
    };
    const existingKeys = this.decryptedKeys ?? [];
    this.setDecryptedKeys(
      Array.from(
        new Map(
          [...existingKeys, newKey].map((item) => [
            item.address.toLowerCase(),
            item,
          ]),
        ).values(),
      ),
    );
  }

  private static setDecryptedKeys(decryptedKeys: DecryptedKeyType[]) {
    this.decryptedKeys = decryptedKeys;
  }

  static getWalletPassword() {
    const decryptedKeys = this.getDecryptedKeys();
    const password: string = decryptedKeys?.[0]?.password ?? "";
    return password;
  }

  static getDecryptedKeys() {
    if (!this.decryptedKeys) {
      this.lock();
      throw new Error("Zond Web3 Wallet is locked");
    }
    return this.decryptedKeys;
  }

  private static clearDecryptedKeys() {
    this.decryptedKeys = undefined;
  }

  static async lockManagerListener(message: MessageType) {
    let result;
    if (message.name === LOCK_MANAGER_MESSAGES.IS_LOCKED) {
      result = await LockManager.isLocked();
      return result;
    } else if (message.name === LOCK_MANAGER_MESSAGES.SET_DECRYPTED_KEYS) {
      // The popup decrypted the keystores locally and is sending us the results.
      LockManager.setDecryptedKeysFromPopup(message?.data ?? []);
      return { success: true };
    } else if (message.name === LOCK_MANAGER_MESSAGES.LOCK) {
      return LockManager.lock();
    } else if (message.name === LOCK_MANAGER_MESSAGES.GET_DECRYPTED_KEYS) {
      return LockManager.getDecryptedKeys();
    } else if (message.name === LOCK_MANAGER_MESSAGES.GET_WALLET_PASSWORD) {
      return LockManager.getWalletPassword();
    } else if (message.name === LOCK_MANAGER_MESSAGES.ENCRYPT_ACCOUNT) {
      return await LockManager.encryptAccount(message?.data ?? {});
    }
  }
}

export default LockManager;

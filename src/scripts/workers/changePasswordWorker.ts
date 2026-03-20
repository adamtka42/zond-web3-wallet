/**
 * Web Worker that re-encrypts all keystores with a new password.
 *
 * 1. Decrypts each keystore with the old password (CPU-heavy scrypt).
 * 2. Re-encrypts each seed with the new password.
 * 3. Returns the new keystores and decrypted key metadata.
 *
 * Runs in a dedicated thread so the popup UI stays responsive.
 */

import { decrypt, encrypt } from "@theqrl/web3-qrl-accounts";
import { getMnemonicFromHexSeed } from "@/functions/getMnemonicFromHexSeed";
import type { KeyStore } from "@theqrl/web3";

export type ChangePasswordWorkerRequest = {
  keystores: KeyStore[];
  oldPassword: string;
  newPassword: string;
};

export type DecryptedKey = {
  password: string;
  address: string;
  mnemonicPhrases: string;
};

export type ChangePasswordWorkerResponse =
  | { success: true; newKeystores: KeyStore[]; newKeys: DecryptedKey[] }
  | { success: false };

self.onmessage = async (
  event: MessageEvent<ChangePasswordWorkerRequest>,
) => {
  const { keystores, oldPassword, newPassword } = event.data;
  try {
    const newKeystores: KeyStore[] = [];
    const newKeys: DecryptedKey[] = [];

    for (const keyStore of keystores) {
      const { address, seed } = await decrypt(keyStore, oldPassword);
      const reEncrypted = await encrypt(seed, newPassword);
      newKeystores.push(reEncrypted);
      newKeys.push({
        password: newPassword,
        address,
        mnemonicPhrases: getMnemonicFromHexSeed(seed),
      });
    }

    self.postMessage({
      success: true,
      newKeystores,
      newKeys,
    } satisfies ChangePasswordWorkerResponse);
  } catch {
    // decrypt() throws when the old password is wrong
    self.postMessage({ success: false } satisfies ChangePasswordWorkerResponse);
  }
};

/**
 * Web Worker that performs the CPU-heavy keystore decryption (scrypt / argon2id).
 *
 * Running in a dedicated worker thread keeps the popup UI fully responsive
 * while the decryption is in progress AND avoids Chrome's MV3 service-worker
 * lifecycle issues (Chrome can't kill a worker that runs inside the popup).
 */

import { decrypt } from "@theqrl/web3-qrl-accounts";
import { getMnemonicFromHexSeed } from "@/functions/getMnemonicFromHexSeed";
import type { KeyStore } from "@theqrl/web3";

export type UnlockWorkerRequest = {
  keystores: KeyStore[];
  password: string;
};

export type DecryptedKey = {
  password: string;
  address: string;
  mnemonicPhrases: string;
};

export type UnlockWorkerResponse =
  | { success: true; keys: DecryptedKey[] }
  | { success: false };

self.onmessage = async (event: MessageEvent<UnlockWorkerRequest>) => {
  const { keystores, password } = event.data;
  try {
    const keys: DecryptedKey[] = [];
    for (const keyStore of keystores) {
      const { address, seed } = await decrypt(keyStore, password);
      keys.push({
        password,
        address,
        mnemonicPhrases: getMnemonicFromHexSeed(seed),
      });
    }
    self.postMessage({ success: true, keys } satisfies UnlockWorkerResponse);
  } catch {
    // decrypt() throws when the password is wrong
    self.postMessage({ success: false } satisfies UnlockWorkerResponse);
  }
};

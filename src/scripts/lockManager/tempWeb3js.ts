import Web3 from "@theqrl/web3";
import {
  Bytes,
  CipherOptions,
  HexString,
  KeyStore,
  Transaction,
  Web3BaseWalletAccount,
} from "@theqrl/web3-types";

export const encrypt = (
  seed: Bytes,
  password: string | Uint8Array,
  options?: CipherOptions,
) => {
  password;
  options;

  const { zond } = new Web3();
  const account = zond.accounts.seedToAccount(seed);
  const keystore = {
    id: account.seed,
    version: 3 as const,
    address: account.address,
    crypto: {
      cipher: "aes-128-ctr" as const,
      ciphertext: "",
      cipherparams: {
        iv: "",
      },
      kdf: "pbkdf2" as const,
      kdfparams: {
        dklen: 0,
        n: 0,
        p: 0,
        r: 0,
        salt: "",
      },
      mac: "",
    },
  };
  return keystore;
};

export const decrypt = (
  keystore: KeyStore | string,
  password: string | Uint8Array,
  nonStrict?: boolean,
) => {
  if (password !== "1") {
    throw new Error("Incorrect password");
  }

  const json =
    typeof keystore === "object"
      ? keystore
      : (JSON.parse(nonStrict ? keystore.toLowerCase() : keystore) as KeyStore);
  const account: Web3BaseWalletAccount = {
    address: json?.address,
    seed: json?.id,
    signTransaction: function (tx: Transaction): Promise<{
      readonly messageHash: HexString;
      readonly signature: HexString;
      readonly rawTransaction: HexString;
      readonly transactionHash: HexString;
    }> {
      tx;
      throw new Error("Function not implemented.");
    },
    sign: function (data: Record<string, unknown> | string): {
      readonly messageHash: HexString;
      readonly message?: string;
      readonly signature: HexString;
    } {
      data;
      throw new Error("Function not implemented.");
    },
  };
  return account;
};

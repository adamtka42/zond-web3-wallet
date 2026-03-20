import { binToMnemonic } from "./mnemonicHelper";
import { Buffer } from "buffer";

export const getMnemonicFromHexSeed = (hexSeed?: string) => {
  if (!hexSeed) return "";
  const trimmedHexSeed = hexSeed.trim();
  if (!trimmedHexSeed) return "";
  const hexSeedBin = Buffer.from(trimmedHexSeed.substring(2), "hex");
  return binToMnemonic(hexSeedBin);
};

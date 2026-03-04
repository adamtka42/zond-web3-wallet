import { QRNS } from "@theqrl/web3-qrl-qrns";

/**
 * Check if input looks like a QRNS name (e.g. alice.qrl, sub.alice.qrl).
 */
export function isQrnsName(input: string): boolean {
  return /^[a-z0-9.-]+\.qrl$/i.test(input.trim());
}

/**
 * Resolve a QRNS name to a Q-address using on-chain lookup.
 * Throws if resolution fails (no contract, name not registered, network error).
 */
export async function resolveQrnsName(
  name: string,
  rpcUrl: string,
): Promise<string> {
  const qrns = new QRNS(undefined, rpcUrl);
  const address = await qrns.getAddress(name);
  return address as string;
}

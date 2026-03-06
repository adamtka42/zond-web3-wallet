import { QRNS, registryAddresses, networkIds } from "@theqrl/web3-qrl-qrns";

/**
 * Check if input looks like a QRNS name (e.g. alice.qrl, sub.alice.qrl).
 */
export function isQrnsName(input: string): boolean {
  return /^[a-z0-9.-]+\.qrl$/i.test(input.trim());
}

/**
 * Look up the QRNS registry address for a given chain ID.
 */
export function getRegistryForChain(chainId: string): string | undefined {
  const networkName = networkIds[chainId];
  if (networkName) {
    return registryAddresses[networkName] || undefined;
  }
  return undefined;
}

/**
 * Resolve a QRNS name to a Q-address using on-chain lookup.
 * Throws if resolution fails (no contract, name not registered, network error).
 */
export async function resolveQrnsName(
  name: string,
  rpcUrl: string,
  registryAddress?: string,
): Promise<string> {
  const qrns = new QRNS(registryAddress, rpcUrl);
  const address = await qrns.getAddress(name);
  const addr = String(address);
  // Convert 0x-prefixed address to Q-prefixed
  if (addr.startsWith("0x")) {
    return "Q" + addr.slice(2);
  }
  return addr;
}

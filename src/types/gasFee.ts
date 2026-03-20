export type GasTier = "low" | "market" | "aggressive" | "advanced";

export type GasFeeOverrides = {
  tier: GasTier;
  maxPriorityFeePerGas?: bigint; // only used when tier = "advanced"
  maxFeePerGas?: bigint; // only used when tier = "advanced"
  gasLimit?: number; // only used when tier = "advanced"
};

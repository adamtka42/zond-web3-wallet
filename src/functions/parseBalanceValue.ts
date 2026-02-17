import { BigNumber } from "bignumber.js";

/**
 * Extracts the numeric value from a formatted balance string like "10.5 QRL" or "1,234.5 TOKEN".
 * Returns a BigNumber for precise comparison. Returns BigNumber(0) for unparseable strings.
 */
export const parseBalanceValue = (formattedBalance: string): BigNumber => {
  try {
    const numericPart = formattedBalance.split(" ")[0].replace(/,/g, "");
    const value = new BigNumber(numericPart);
    return value.isNaN() ? new BigNumber(0) : value;
  } catch {
    return new BigNumber(0);
  }
};

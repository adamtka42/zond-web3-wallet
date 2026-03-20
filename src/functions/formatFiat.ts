const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "\u20AC",
  PLN: "z\u0142",
  GBP: "\u00A3",
  CHF: "CHF",
  JPY: "\u00A5",
};

export const formatFiat = (
  qrlAmount: number | string,
  price: number,
  currency: string,
): string => {
  const amount = typeof qrlAmount === "string" ? parseFloat(qrlAmount) : qrlAmount;
  if (isNaN(amount) || price <= 0) return "";

  const fiatValue = amount * price;
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const decimals = currency === "JPY" ? 0 : 2;

  const formatted = fiatValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${symbol}${formatted}`;
};

export const formatFiatCompact = (
  qrlAmount: number | string,
  price: number,
  currency: string,
): string => {
  const result = formatFiat(qrlAmount, price, currency);
  if (!result) return "";
  return `\u2248 ${result}`;
};

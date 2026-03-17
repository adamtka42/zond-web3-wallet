import { describe, expect, it } from "vitest";
import { formatFiat, formatFiatCompact } from "./formatFiat";

describe("formatFiat", () => {
  it("should format USD with dollar sign", () => {
    const result = formatFiat(10, 1.5, "USD");
    expect(result).toContain("$");
    expect(result).toContain("15");
  });

  it("should format EUR with euro sign", () => {
    const result = formatFiat(10, 1.5, "EUR");
    expect(result).toContain("\u20AC");
  });

  it("should format PLN with złoty symbol", () => {
    const result = formatFiat(10, 1.5, "PLN");
    expect(result).toContain("zł");
  });

  it("should format GBP with pound sign", () => {
    const result = formatFiat(10, 1.5, "GBP");
    expect(result).toContain("\u00A3");
  });

  it("should format CHF with CHF label", () => {
    const result = formatFiat(10, 1.5, "CHF");
    expect(result).toContain("CHF");
  });

  it("should format JPY with yen sign and no decimals", () => {
    const result = formatFiat(10, 150, "JPY");
    expect(result).toContain("\u00A5");
    // JPY should have 0 decimal places
    expect(result).not.toContain(".");
  });

  it("should accept string amount", () => {
    const result = formatFiat("10", 1.5, "USD");
    expect(result).toContain("$");
    expect(result).toContain("15");
  });

  it("should return empty string for NaN amount", () => {
    expect(formatFiat("abc", 1.5, "USD")).toBe("");
    expect(formatFiat(NaN, 1.5, "USD")).toBe("");
  });

  it("should return empty string for zero price", () => {
    expect(formatFiat(10, 0, "USD")).toBe("");
  });

  it("should return empty string for negative price", () => {
    expect(formatFiat(10, -1, "USD")).toBe("");
  });

  it("should use currency code as fallback for unknown currencies", () => {
    const result = formatFiat(10, 2, "BRL");
    expect(result).toContain("BRL");
  });

  it("should handle zero amount", () => {
    const result = formatFiat(0, 1.5, "USD");
    expect(result).toContain("$");
    expect(result).toContain("0");
  });

  it("should handle very small amounts", () => {
    const result = formatFiat(0.001, 1.5, "USD");
    expect(result).toContain("$");
    expect(result).toContain("0");
  });
});

describe("formatFiatCompact", () => {
  it("should prepend ≈ symbol to formatted value", () => {
    const result = formatFiatCompact(10, 1.5, "USD");
    expect(result).toMatch(/^≈ /);
    expect(result).toContain("$");
  });

  it("should return empty string when formatFiat returns empty", () => {
    expect(formatFiatCompact("abc", 1.5, "USD")).toBe("");
    expect(formatFiatCompact(10, 0, "USD")).toBe("");
  });
});

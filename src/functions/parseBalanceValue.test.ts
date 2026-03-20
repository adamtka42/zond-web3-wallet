import { describe, expect, it } from "vitest";
import { parseBalanceValue } from "./parseBalanceValue";

describe("parseBalanceValue", () => {
  it("should parse '10.5 QRL' to 10.5", () => {
    expect(parseBalanceValue("10.5 QRL").toNumber()).toBe(10.5);
  });

  it("should parse '0.0 QRL' to 0", () => {
    expect(parseBalanceValue("0.0 QRL").toNumber()).toBe(0);
  });

  it("should parse '1,234.5678 QRL' to 1234.5678", () => {
    expect(parseBalanceValue("1,234.5678 QRL").toNumber()).toBe(1234.5678);
  });

  it("should parse '100.5 TOKEN' to 100.5", () => {
    expect(parseBalanceValue("100.5 TOKEN").toNumber()).toBe(100.5);
  });

  it("should parse '100,000,000.0 TOK' to 100000000", () => {
    expect(parseBalanceValue("100,000,000.0 TOK").toNumber()).toBe(100000000);
  });

  it("should parse '0.0001 QRL' to 0.0001", () => {
    expect(parseBalanceValue("0.0001 QRL").toNumber()).toBe(0.0001);
  });

  it("should return 0 for empty string", () => {
    expect(parseBalanceValue("").toNumber()).toBe(0);
  });

  it("should return 0 for unparseable string", () => {
    expect(parseBalanceValue("invalid").toNumber()).toBe(0);
  });
});

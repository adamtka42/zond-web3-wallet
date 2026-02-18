import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import type { TransactionHistoryEntry } from "@/types/transactionHistory";

const mockGetTransactionHistory = jest.fn<any>().mockResolvedValue([]);
const mockSetTransactionHistoryEntry = jest
  .fn<any>()
  .mockResolvedValue(undefined);
const mockClearTransactionHistory = jest
  .fn<any>()
  .mockResolvedValue(undefined);

jest.mock("@/utilities/storageUtil", () => ({
  __esModule: true,
  default: {
    getTransactionHistory: (...args: any[]) =>
      mockGetTransactionHistory(...args),
    setTransactionHistoryEntry: (...args: any[]) =>
      mockSetTransactionHistoryEntry(...args),
    clearTransactionHistory: (...args: any[]) =>
      mockClearTransactionHistory(...args),
  },
}));

const makeSampleEntry = (
  overrides: Partial<TransactionHistoryEntry> = {},
): TransactionHistoryEntry => ({
  id: "0xtxhash1",
  from: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
  to: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
  amount: 2.5,
  tokenSymbol: "QRL",
  tokenName: "Zond",
  isZrc20Token: false,
  tokenContractAddress: "",
  tokenDecimals: 18,
  transactionHash: "0xtxhash1",
  blockNumber: "100",
  gasUsed: "21000",
  effectiveGasPrice: "1000000000",
  status: true,
  timestamp: Date.now(),
  chainId: "0x1",
  ...overrides,
});

describe("TransactionHistoryStore", () => {
  // Dynamic import so mocks are in place
  let TransactionHistoryStore: typeof import("@/stores/transactionHistoryStore").default;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockGetTransactionHistory.mockResolvedValue([]);
    const module = await import("@/stores/transactionHistoryStore");
    TransactionHistoryStore = module.default;
  });

  it("should initialize with empty state", () => {
    const store = new TransactionHistoryStore();
    expect(store.transactions).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.filter).toBe("all");
    expect(store.filteredTransactions).toEqual([]);
  });

  it("should load history from storage", async () => {
    const entries = [makeSampleEntry(), makeSampleEntry({ id: "0xtxhash2", transactionHash: "0xtxhash2" })];
    mockGetTransactionHistory.mockResolvedValue(entries);

    const store = new TransactionHistoryStore();
    await store.loadHistory("Q20B714091cF2a62DADda2847803e3f1B9D2D3779");

    expect(mockGetTransactionHistory).toHaveBeenCalledWith(
      "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
    );
    expect(store.transactions).toEqual(entries);
    expect(store.isLoading).toBe(false);
  });

  it("should add transaction and reload", async () => {
    const entry = makeSampleEntry();
    mockGetTransactionHistory.mockResolvedValue([entry]);

    const store = new TransactionHistoryStore();
    await store.addTransaction(
      "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
      entry,
    );

    expect(mockSetTransactionHistoryEntry).toHaveBeenCalledWith(
      "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
      entry,
    );
    expect(mockGetTransactionHistory).toHaveBeenCalledWith(
      "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
    );
    expect(store.transactions).toEqual([entry]);
  });

  it("should set filter", () => {
    const store = new TransactionHistoryStore();
    store.setFilter("native");
    expect(store.filter).toBe("native");
    store.setFilter("zrc20");
    expect(store.filter).toBe("zrc20");
    store.setFilter("all");
    expect(store.filter).toBe("all");
  });

  it("should return filtered transactions for native filter", () => {
    const store = new TransactionHistoryStore();
    const nativeEntry = makeSampleEntry({ isZrc20Token: false });
    const zrc20Entry = makeSampleEntry({
      id: "0xtxhash2",
      transactionHash: "0xtxhash2",
      isZrc20Token: true,
      tokenSymbol: "TST",
    });

    // Manually set transactions since we're testing the computed property
    store.transactions = [nativeEntry, zrc20Entry];

    store.setFilter("native");
    expect(store.filteredTransactions).toEqual([nativeEntry]);

    store.setFilter("zrc20");
    expect(store.filteredTransactions).toEqual([zrc20Entry]);

    store.setFilter("all");
    expect(store.filteredTransactions).toEqual([nativeEntry, zrc20Entry]);
  });

  it("should clear history", async () => {
    const store = new TransactionHistoryStore();
    store.transactions = [makeSampleEntry()];

    await store.clearHistory("Q20B714091cF2a62DADda2847803e3f1B9D2D3779");

    expect(mockClearTransactionHistory).toHaveBeenCalledWith(
      "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
    );
    expect(store.transactions).toEqual([]);
  });

  it("should handle storage errors gracefully in loadHistory", async () => {
    mockGetTransactionHistory.mockRejectedValue(new Error("Storage error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const store = new TransactionHistoryStore();
    await store.loadHistory("Q20B714091cF2a62DADda2847803e3f1B9D2D3779");

    expect(store.transactions).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { resolveIpfsUrl, fetchMetadata } from "./ipfsUtil";

describe("resolveIpfsUrl", () => {
  it("should return empty string for empty input", () => {
    expect(resolveIpfsUrl("")).toBe("");
  });

  it("should resolve ipfs://ipfs/ URIs", () => {
    expect(resolveIpfsUrl("ipfs://ipfs/QmTest123")).toBe(
      "https://ipfs.io/ipfs/QmTest123",
    );
  });

  it("should resolve ipfs:// URIs", () => {
    expect(resolveIpfsUrl("ipfs://QmTest123")).toBe(
      "https://ipfs.io/ipfs/QmTest123",
    );
  });

  it("should return data URIs as-is", () => {
    const dataUri = "data:image/png;base64,abc123";
    expect(resolveIpfsUrl(dataUri)).toBe(dataUri);
  });

  it("should return http URLs as-is", () => {
    const url = "http://example.com/image.png";
    expect(resolveIpfsUrl(url)).toBe(url);
  });

  it("should return https URLs as-is", () => {
    const url = "https://example.com/image.png";
    expect(resolveIpfsUrl(url)).toBe(url);
  });

  it("should treat bare strings as CIDs", () => {
    expect(resolveIpfsUrl("QmTest123")).toBe(
      "https://ipfs.io/ipfs/QmTest123",
    );
  });
});

describe("fetchMetadata", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null for empty URI", async () => {
    const result = await fetchMetadata("");
    expect(result).toBeNull();
  });

  it("should return parsed JSON on success", async () => {
    const mockData = { name: "Test NFT", image: "ipfs://Qm123" };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    ) as any;

    const result = await fetchMetadata("ipfs://QmMetadata");
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://ipfs.io/ipfs/QmMetadata",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("should return null on non-ok response", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false }),
    ) as any;

    const result = await fetchMetadata("ipfs://QmBad");
    expect(result).toBeNull();
  });

  it("should return null on fetch error", async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error("Network error")),
    ) as any;

    const result = await fetchMetadata("ipfs://QmFail");
    expect(result).toBeNull();
  });
});

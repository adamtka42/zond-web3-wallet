const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
const METADATA_TIMEOUT_MS = 10000;

/**
 * Converts IPFS URIs to HTTP gateway URLs.
 * Handles ipfs://, ipfs://ipfs/, and plain CIDs.
 */
export function resolveIpfsUrl(uri: string): string {
  if (!uri) return "";
  if (uri.startsWith("ipfs://ipfs/")) {
    return `${IPFS_GATEWAY}${uri.slice("ipfs://ipfs/".length)}`;
  }
  if (uri.startsWith("ipfs://")) {
    return `${IPFS_GATEWAY}${uri.slice("ipfs://".length)}`;
  }
  if (uri.startsWith("data:")) {
    return uri;
  }
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return uri;
  }
  // Assume bare CID
  return `${IPFS_GATEWAY}${uri}`;
}

/**
 * Fetches JSON metadata from a token URI with timeout.
 */
export async function fetchMetadata(
  tokenUri: string,
): Promise<Record<string, unknown> | null> {
  const url = resolveIpfsUrl(tokenUri);
  if (!url) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      METADATA_TIMEOUT_MS,
    );
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

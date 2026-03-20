import PhishingDetector from "eth-phishing-detect/src/detector";
import browser from "webextension-polyfill";

const PHISHING_CONFIG_URL =
  "https://raw.githubusercontent.com/MetaMask/eth-phishing-detect/master/src/config.json";
const PHISHING_CACHE_KEY = "PHISHING_BLOCKLIST_CACHE";
const PHISHING_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
export const PHISHING_ALARM_NAME = "QRL_PHISHING_REFRESH";

export type PhishingCheckResult = {
  isDomainPhishing: boolean;
  matchType?: string;
  matchedDomain?: string;
};

type PhishingConfig = {
  whitelist?: string[];
  blacklist?: string[];
  fuzzylist?: string[];
  tolerance?: number;
};

type CachedConfig = {
  config: PhishingConfig;
  timestamp: number;
};

let detectorInstance: InstanceType<typeof PhishingDetector> | null = null;

async function fetchRemoteConfig(): Promise<PhishingConfig | null> {
  try {
    const response = await fetch(PHISHING_CONFIG_URL);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn("QrlWeb3Wallet: Failed to fetch phishing blocklist", error);
    return null;
  }
}

async function getCachedConfig(): Promise<CachedConfig | null> {
  const data = await browser.storage.local.get(PHISHING_CACHE_KEY);
  return (data?.[PHISHING_CACHE_KEY] as CachedConfig) ?? null;
}

async function setCachedConfig(config: PhishingConfig): Promise<void> {
  const cached: CachedConfig = { config, timestamp: Date.now() };
  await browser.storage.local.set({ [PHISHING_CACHE_KEY]: cached });
}

function createDetector(config: PhishingConfig) {
  return new PhishingDetector([
    {
      allowlist: config.whitelist ?? [],
      blocklist: config.blacklist ?? [],
      fuzzylist: config.fuzzylist ?? [],
      tolerance: config.tolerance ?? 3,
      name: "MetaMask",
      version: 1,
    },
  ]);
}

export async function initializePhishingDetector(): Promise<void> {
  const cached = await getCachedConfig();
  const isCacheStale =
    !cached || Date.now() - cached.timestamp > PHISHING_CACHE_TTL;

  if (isCacheStale) {
    const remoteConfig = await fetchRemoteConfig();
    if (remoteConfig) {
      await setCachedConfig(remoteConfig);
      detectorInstance = createDetector(remoteConfig);
      return;
    }
  }

  if (cached?.config) {
    detectorInstance = createDetector(cached.config);
  }
}

export function checkDomain(url: string): PhishingCheckResult {
  if (!detectorInstance) {
    return { isDomainPhishing: false };
  }

  try {
    const hostname = new URL(url).hostname;

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      return { isDomainPhishing: false };
    }

    const result = detectorInstance.check(hostname);
    return {
      isDomainPhishing: result.result,
      matchType: result.type,
      matchedDomain: result.match,
    };
  } catch {
    return { isDomainPhishing: false };
  }
}

export async function setupPhishingRefreshAlarm(): Promise<void> {
  await browser.alarms.create(PHISHING_ALARM_NAME, {
    periodInMinutes: 24 * 60,
  });
}

export async function handlePhishingRefreshAlarm(): Promise<void> {
  await initializePhishingDetector();
}

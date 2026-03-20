declare module "eth-phishing-detect/src/detector" {
  type PhishingDetectorConfig = {
    allowlist?: string[];
    blocklist?: string[];
    fuzzylist?: string[];
    tolerance?: number;
    name: string;
    version: number;
  };

  type CheckResult = {
    result: boolean;
    type: string;
    match?: string;
  };

  class PhishingDetector {
    constructor(opts: PhishingDetectorConfig[]);
    check(domain: string): CheckResult;
  }

  export default PhishingDetector;
}

/**
 * Ledger Integration Module Exports.
 *
 * ENTRY POINT FOR LEDGER INTEGRATION
 * ==================================
 *
 * This file is the main entry point for all Ledger functionality.
 * UI components and Store should import from this file, not from individual modules.
 *
 * MODULE ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  index.ts (this file) - public API                             │
 * │      ↓                                                          │
 * │  ledgerService.ts - high-level business logic                  │
 * │      ↓                                                          │
 * │  ledgerApdu.ts - APDU protocol helper functions                │
 * │      ↓                                                          │
 * │  ledgerTransport.ts - low-level WebHID communication           │
 * │      ↓                                                          │
 * │  ledgerTypes.ts - TypeScript interfaces                        │
 * └─────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// TYPES - all TypeScript interfaces and types
// ============================================================================
export type {
  LedgerDeviceInfo,
  LedgerAccount,
  StoredLedgerAccount,
  LedgerSigningStatus,
  LedgerSignResult,
  LedgerMessageSignResult,
  LedgerConnectionState,
  LedgerError,
  GetPublicKeyOptions,
  SignTransactionOptions,
  AccountType,
  AccountWithType,
  FetchAccountsParams,
  LedgerEventCallbacks,
  LedgerServiceConfig,
} from "./ledgerTypes";

// ============================================================================
// SERVICES - main API for Ledger communication
// ============================================================================

/**
 * Main Ledger service (singleton).
 *
 * Use this service for:
 * - Connecting to device: ledgerService.connect()
 * - Fetching accounts: ledgerService.getAccounts()
 * - Signing transactions: ledgerService.signTransaction()
 */
export { ledgerService } from "./ledgerService";

/**
 * Low-level WebHID transport (singleton).
 *
 * Usually you don't need to use directly - ledgerService uses it internally.
 * Useful for:
 * - Checking browser support: ledgerTransport.isSupported()
 * - Checking connection: ledgerTransport.isConnected()
 * - Sending raw APDU commands
 *
 * NOTE: When VITE_USE_SPECULOS=true, this exports a Speculos-compatible
 * transport instead of WebHID transport.
 */
export { ledgerTransport, LedgerTransportService } from "./ledgerTransport";
export type { ILedgerTransport } from "./ledgerTransport";

/**
 * Speculos transport for emulator testing.
 * Only use directly when you need Speculos-specific features like button simulation.
 */
export { speculosTransport, SpeculosTransportService } from "./speculosTransport";

// ============================================================================
// APDU HELPER FUNCTIONS - exported for advanced users
// ============================================================================
export {
  // BIP-44 paths
  packDerivationPath,
  getDerivationPath,
  // Chunking
  splitIntoChunks,
  combineSignatureChunks,
  // Response parsing
  parseQrlAddress,
  parseAppVersion,
  parseAppName,
  checkStatusWord,
  extractResponseData,
  // Error handling
  createLedgerError,
  isRetryableError,
  isUserRejection,
  isWrongApp,
  // Conversions
  hexToBuffer,
  bufferToHex,
} from "./ledgerApdu";

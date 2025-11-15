// List of methods that can be called by the dApp without user interaction
export const UNRESTRICTED_METHODS = Object.freeze({
  NET_VERSION: "net_version",
  WALLET_GET_CALL_STATUS: "wallet_getCallsStatus",
  WALLET_GET_PERMISSIONS: "wallet_getPermissions",
  WALLET_REVOKE_PERMISSIONS: "wallet_revokePermissions",
  WEB_3_CLIENT_VERSION: "web3_clientVersion",
  ZOND_ACCOUNTS: "zond_accounts",
  ZOND_BLOCK_NUMBER: "zond_blockNumber",
  ZOND_CALL: "zond_call",
  ZOND_CHAIN_ID: "zond_chainId",
  ZOND_ESTIMATE_GAS: "zond_estimateGas",
  ZOND_FEE_HISTORY: "zond_feeHistory",
  ZOND_GAS_PRICE: "zond_gasPrice",
  ZOND_GET_BALANCE: "zond_getBalance",
  ZOND_GET_BLOCK_BY_HASH: "zond_getBlockByHash",
  ZOND_GET_BLOCK_BY_NUMBER: "zond_getBlockByNumber",
  ZOND_GET_BLOCK_TRANSACTION_COUNT_BY_HASH:
    "zond_getBlockTransactionCountByHash",
  ZOND_GET_BLOCK_TRANSACTION_COUNT_BY_NUMBER:
    "zond_getBlockTransactionCountByNumber",
  ZOND_GET_CODE: "zond_getCode",
  ZOND_GET_FILTER_CHANGES: "zond_getFilterChanges",
  ZOND_GET_FILTER_LOGS: "zond_getFilterLogs",
  ZOND_GET_LOGS: "zond_getLogs",
  ZOND_GET_PROOF: "zond_getProof",
  ZOND_GET_STORAGE_AT: "zond_getStorageAt",
  ZOND_GET_TRANSACTION_BY_BLOCK_HASH_AND_INDEX:
    "zond_getTransactionByBlockHashAndIndex",
  ZOND_GET_TRANSACTION_BY_BLOCK_NUMBER_AND_INDEX:
    "zond_getTransactionByBlockNumberAndIndex",
  ZOND_GET_TRANSACTION_BY_HASH: "zond_getTransactionByHash",
  ZOND_GET_TRANSACTION_COUNT: "zond_getTransactionCount",
  ZOND_GET_TRANSACTION_RECEIPT: "zond_getTransactionReceipt",
  ZOND_NEW_BLOCK_FILTER: "zond_newBlockFilter",
  ZOND_NEW_FILTER: "zond_newFilter",
  ZOND_NEW_PENDING_TRANSACTION_FILTER: "zond_newPendingTransactionFilter",
  ZOND_SEND_RAW_TRANSACTION: "zond_sendRawTransaction",
  ZOND_SUBSCRIBE: "zond_subscribe",
  ZOND_SYNCING: "zond_syncing",
  ZOND_UNINSTALL_FILTER: "zond_uninstallFilter",
  ZOND_UNSUBSCRIBE: "zond_unsubscribe",
  ZOND_WEB3_WALLET_GET_PROVIDER_STATE: "zondWallet_getProviderState",
});

// List of methods that require user interaction (Approval/Rejection by the user)
export const RESTRICTED_METHODS = Object.freeze({
  PERSONAL_SIGN: "personal_sign",
  WALLET_ADD_ZOND_CHAIN: "wallet_addZondChain",
  WALLET_GET_CAPABILITIES: "wallet_getCapabilities",
  WALLET_REQUEST_PERMISSIONS: "wallet_requestPermissions",
  WALLET_SEND_CALLS: "wallet_sendCalls",
  WALLET_SWITCH_ZOND_CHAIN: "wallet_switchZondChain",
  WALLET_WATCH_ASSET: "wallet_watchAsset",
  ZOND_REQUEST_ACCOUNTS: "zond_requestAccounts",
  ZOND_SEND_TRANSACTION: "zond_sendTransaction",
  ZOND_SIGN_TYPED_DATA_V4: "zond_signTypedData_v4",
});

export const ALL_REQUEST_METHODS = Object.values({
  ...RESTRICTED_METHODS,
  ...UNRESTRICTED_METHODS,
});

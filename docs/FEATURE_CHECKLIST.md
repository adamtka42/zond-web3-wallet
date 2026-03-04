# Feature Checklist

| # | Status | Feature |
|---|--------|---------|
| 1 | ✅ | Transaction History -- outgoing TX list with status and token filtering |
| 2 | ✅ | Transaction Detail View -- gas breakdown, copy actions, status badges |
| 3 | ✅ | Balance Validation -- pre-send insufficient funds check |
| 4 | ✅ | Contacts & Recipient Picker -- address book with My Accounts / Contacts / Recent |
| 5 | ✅ | Receive Screen -- QR code and copy-to-clipboard |
| 6 | ✅ | Settings Page -- centralized preferences with sub-page navigation |
| 7 | ✅ | Auto-Lock Timer -- configurable inactivity timeout via alarms API |
| 8 | ✅ | Responsive Fullscreen Layout -- wider tab/side panel layout, sticky header |
| 9 | ✅ | Side Panel Mode -- persistent Chrome Side Panel with preference switching |
| 10 | ✅ | Custom Gas Fee Settings -- Low / Market / Aggressive / Advanced tiers |
| 11 | ✅ | Speed Up / Cancel Pending TX -- replace stuck transactions |
| 12 | ✅ | Fiat Currency Display -- CoinGecko prices, currency selector, privacy toggle |
| 13 | ✅ | Change Password -- re-encrypt keystores with new password |
| 14 | ✅ | DApp Phishing Detection -- blocklist check on dApp connection requests |
| 15 | ✅ | QRNS Integration -- resolve .qrl names to Q-addresses |
| 16 | ✅ | Notifications -- browser push for TX confirmation/failure |
| 17 | ⬜ | NFT Support (ZRC-721 / ZRC-1155) -- gallery, import, and transfer |
| 18 | ➖ | ~~Buy Crypto with Fiat -- requires on-ramp provider to support QRL~~ |
| 19 | ➖ | ~~Swap / DEX Integration -- requires functioning DEX on Zond~~ |
| 20 | ➖ | ~~Additional Hardware Wallets -- requires device-side firmware per vendor~~ |
| 21 | ✅ | Account Labels -- custom names with inline editing |
| 22 | ✅ | Hide / Archive Accounts -- hide unused accounts from main list |
| — | ✅ | i18n -- internationalization (English, Spanish, German) |

## Future TODO
- ~~Refactor TX send to async broadcast~~ ✅ Done — TX is now saved as "pending" immediately after signing, broadcast happens in background, polling confirms.

import withSuspense from "@/functions/withSuspense";
import { lazy } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const ZondWeb3Wallet = withSuspense(
  lazy(() => import("@/components/ZondWeb3Wallet/ZondWeb3Wallet")),
);
const Home = withSuspense(
  lazy(
    () =>
      import("@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Home/Home"),
  ),
);
const CreateAccount = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/CreateAccount/CreateAccount"
      ),
  ),
);
const ImportAccount = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ImportAccount/ImportAccount"
      ),
  ),
);
const ImportToken = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ImportToken/ImportToken"
      ),
  ),
);
const AllZRC20Tokens = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AllZRC20Tokens/AllZRC20Tokens"
      ),
  ),
);
const AccountList = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/AccountList"
      ),
  ),
);
const DAppConnectivity = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/DAppConnectivity/DAppConnectivity"
      ),
  ),
);
const EditDAppConnectedAccounts = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/DAppConnectivity/ConnectivityWithWallet/DAppConnected/DAppConnectedAccounts/EditDAppConnectedAccounts/EditDAppConnectedAccounts"
      ),
  ),
);
const EditDAppConnectedBlockchains = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/DAppConnectivity/ConnectivityWithWallet/DAppConnected/DAppConnectedBlockchains/EditDAppConnectedBlockchains/EditDAppConnectedBlockchains"
      ),
  ),
);
const ChainConnectivity = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/ChainConnectivity"
      ),
  ),
);
const AddEditChain = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/NewChain/AddEditChain/AddEditChain"
      ),
  ),
);
const TokenTransfer = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/TokenTransfer/TokenTransfer"
      ),
  ),
);
const ImportLedger = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ImportLedger/ImportLedger"
      ),
  ),
);

export const ROUTES = {
  HOME: "/",
  CREATE_ACCOUNT: "/create-account",
  IMPORT_ACCOUNT: "/import-account",
  IMPORT_LEDGER: "/import-ledger",
  IMPORT_TOKEN: "/import-token",
  ALL_ZRC_20_TOKENS: "/all-zrc-20-tokens",
  TOKEN_TRANSFER: "/token-transfer",
  ACCOUNT_LIST: "/account-list",
  DAPP_CONNECTIVITY: "/dapp-connectivity",
  EDIT_DAPP_CONNECTED_ACCOUNTS: "/edit-dapp-connected-accounts",
  EDIT_DAPP_CONNECTED_BLOCKCHAINS: "/edit-dapp-connected-blockchains",
  CHAIN_CONNECTIVITY: "/chain-connectivity",
  ADD_EDIT_CHAIN: "/add-edit-chain",
  DEFAULT: "*",
};

const router = createMemoryRouter([
  {
    path: ROUTES.HOME,
    element: <ZondWeb3Wallet />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ROUTES.CREATE_ACCOUNT,
        element: <CreateAccount />,
      },
      {
        path: ROUTES.IMPORT_ACCOUNT,
        element: <ImportAccount />,
      },
      {
        path: ROUTES.IMPORT_LEDGER,
        element: <ImportLedger />,
      },
      {
        path: ROUTES.IMPORT_TOKEN,
        element: <ImportToken />,
      },
      {
        path: ROUTES.ALL_ZRC_20_TOKENS,
        element: <AllZRC20Tokens />,
      },
      {
        path: ROUTES.TOKEN_TRANSFER,
        element: <TokenTransfer />,
      },
      {
        path: ROUTES.ACCOUNT_LIST,
        element: <AccountList />,
      },
      {
        path: ROUTES.DAPP_CONNECTIVITY,
        element: <DAppConnectivity />,
      },
      {
        path: ROUTES.EDIT_DAPP_CONNECTED_ACCOUNTS,
        element: <EditDAppConnectedAccounts />,
      },
      {
        path: ROUTES.EDIT_DAPP_CONNECTED_BLOCKCHAINS,
        element: <EditDAppConnectedBlockchains />,
      },
      {
        path: ROUTES.CHAIN_CONNECTIVITY,
        element: <ChainConnectivity />,
      },
      {
        path: ROUTES.ADD_EDIT_CHAIN,
        element: <AddEditChain />,
      },
    ],
  },
  {
    path: ROUTES.DEFAULT,
    element: <ZondWeb3Wallet />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

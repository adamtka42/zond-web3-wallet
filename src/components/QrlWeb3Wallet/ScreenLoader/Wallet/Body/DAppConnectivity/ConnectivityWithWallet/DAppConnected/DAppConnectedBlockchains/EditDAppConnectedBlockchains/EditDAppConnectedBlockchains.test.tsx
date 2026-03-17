import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditDAppConnectedBlockchains from "./EditDAppConnectedBlockchains";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Shared/BackButton/BackButton",
  () => ({ default: () => <div>Mocked Back Button</div> }),
);
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/DAppConnectivity/ActiveBrowserTab/ActiveBrowserTabIcon/ActiveBrowserTabIcon",
  () => ({ default: () => <div>Mocked Active Browser Tab Icon</div> }),
);
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/PermissionRequiredContent/DAppRequestWebsite/DAppRequestFeature/QrlRequestAccount/QrlRequestAccountContent/QrlRequestAccountBlockchainSelection/QrlRequestAccountBlockchainSelection",
  () => ({ default: () => <div>Mocked Qrl Request Account Blockchain Selection</div> }),
);

describe("EditDAppConnectedBlockchains", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore({
      dAppRequestStore: {
        currentTabData: {
          connectedBlockchains: [
            {
              chainId: "0x5",
              chainName: "Test chain name",
              rpcUrls: [],
              blockExplorerUrls: [],
              iconUrls: [],
              nativeCurrency: {
                name: "Test native currency",
                symbol: "TST",
                decimals: 18,
              },
              defaultRpcUrl: "http://testDefaultRpcUrl",
              defaultBlockExplorerUrl: "http://testDefaultExplorerUrl",
              defaultIconUrl: "http://testDefaultIconUrl",
              isTestnet: false,
              defaultWsRpcUrl: "http://testDefaultRpcUrl",
              isCustomChain: true,
            },
          ],
        },
      },
    }),
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <EditDAppConnectedBlockchains />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the edit dapp connected blockchains component", async () => {
    renderComponent();

    expect(screen.getByText("Mocked Back Button")).toBeInTheDocument();
    expect(screen.getByText("Edit connected blockchains")).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Active Browser Tab Icon"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Qrl Request Account Blockchain Selection"),
    ).toBeInTheDocument();
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeEnabled();
    const editButton = screen.getByRole("button", { name: "Edit blockchains" });
    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeEnabled();
  });
});

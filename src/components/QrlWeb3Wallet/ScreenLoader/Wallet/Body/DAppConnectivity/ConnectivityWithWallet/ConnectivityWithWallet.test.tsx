import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConnectivityWithWallet from "./ConnectivityWithWallet";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/DAppConnectivity/ConnectivityWithWallet/DAppConnected/DAppConnected",
  () => ({ default: () => <div>Mocked DApp Connected</div> }),
);
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/DAppConnectivity/ConnectivityWithWallet/DAppNotConnected/DAppNotConnected",
  () => ({ default: () => <div>Mocked DApp Not Connected</div> }),
);

describe("ConnectivityWithWallet", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ConnectivityWithWallet />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the dapp connected component if connected", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          hasDAppConnected: true,
        },
      }),
    );

    expect(screen.getByText("Mocked DApp Connected")).toBeInTheDocument();
    expect(
      screen.queryByText("Mocked DApp Not Connected"),
    ).not.toBeInTheDocument();
  });

  it("should render the dapp not connected component if not connected", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          hasDAppConnected: false,
        },
      }),
    );

    expect(screen.getByText("Mocked DApp Not Connected")).toBeInTheDocument();
    expect(screen.queryByText("Mocked DApp Connected")).not.toBeInTheDocument();
  });
});

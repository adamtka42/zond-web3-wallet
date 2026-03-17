import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DAppConnectivity from "./DAppConnectivity";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/DAppConnectivity/ActiveBrowserTab/ActiveBrowserTab",
  () => ({ default: () => <div>Mocked Active Browser Tab</div> }),
);
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/DAppConnectivity/ConnectivityWithWallet/ConnectivityWithWallet",
  () => ({ default: () => <div>Mocked Connectivity With Wallet</div> }),
);

describe("DAppConnectivity", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <DAppConnectivity />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the dapp connectivity component", () => {
    renderComponent();

    expect(screen.getByText("Mocked Active Browser Tab")).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Connectivity With Wallet"),
    ).toBeInTheDocument();
  });
});

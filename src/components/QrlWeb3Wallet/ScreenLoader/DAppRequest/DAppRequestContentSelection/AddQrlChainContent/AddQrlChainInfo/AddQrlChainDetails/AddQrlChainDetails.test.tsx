import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddQrlChainDetails from "./AddQrlChainDetails";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/AddQrlChainContent/AddQrlChainInfo/AddQrlChainDetails/CurrencyImagePreload/CurrencyImagePreload",
  () => ({ default: () => <div>Mocked Currency Image Preload</div> }),
);
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/AddQrlChainContent/AddQrlChainInfo/AddQrlChainDetails/AddQrlChainUrlList/AddQrlChainUrlList",
  () => ({ default: () => <div>Mocked Add Qrl Chain Url List</div> }),
);

describe("AddQrlChainDetails", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AddQrlChainDetails />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the add qrl chain details component", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: {
            params: [
              {
                chainId: "0x5",
                chainName: "Test chain name",
                rpcUrls: ["https://testDefaultRpcUrl"],
                blockExplorerUrls: [],
                iconUrls: [],
                nativeCurrency: {
                  name: "Test native currency",
                  symbol: "TSTA",
                  decimals: 18,
                },
              },
            ],
          },
        },
      }),
    );

    expect(screen.getByText("Chain name")).toBeInTheDocument();
    expect(screen.getByText("Test chain name")).toBeInTheDocument();
    expect(screen.getByText("Chain ID")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Symbol")).toBeInTheDocument();
    expect(screen.getByText("TSTA")).toBeInTheDocument();
    expect(screen.getByText("Decimals")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Currency Image Preload"),
    ).toBeInTheDocument();
    expect(screen.getByText("Currency name")).toBeInTheDocument();
    expect(screen.getByText("Test native currency")).toBeInTheDocument();
    expect(screen.getAllByText("Mocked Add Qrl Chain Url List")).toHaveLength(
      3,
    );
  });
});

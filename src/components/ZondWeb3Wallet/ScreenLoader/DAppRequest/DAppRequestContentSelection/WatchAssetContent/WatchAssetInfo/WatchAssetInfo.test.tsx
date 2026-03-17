import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WatchAssetInfo from "./WatchAssetInfo";

vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/AddZondChainContent/AddZondChainInfo/AddZondChainDetails/CurrencyImagePreload/CurrencyImagePreload",
  () => ({ default: () => <div>Mocked Currency Image Preload</div> }),
);

describe("WatchAssetInfo", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore({
      dAppRequestStore: {
        dAppRequestData: {
          params: [
            {
              options: {
                address: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
                symbol: "TST",
                image: "testImage",
                decimals: 18,
              },
            },
          ],
        },
      },
    }),
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <WatchAssetInfo />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the watch asset info component", () => {
    renderComponent();

    expect(screen.getByText("Token address")).toBeInTheDocument();
    expect(
      screen.getByText("Q 20B71 4091c F2a62 DADda 28478 03e3f 1B9D2 D3779"),
    ).toBeInTheDocument();
    expect(screen.getByText("Symbol")).toBeInTheDocument();
    expect(screen.getByText("TST")).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Currency Image Preload"),
    ).toBeInTheDocument();
    expect(screen.getByText("Decimals")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
  });
});

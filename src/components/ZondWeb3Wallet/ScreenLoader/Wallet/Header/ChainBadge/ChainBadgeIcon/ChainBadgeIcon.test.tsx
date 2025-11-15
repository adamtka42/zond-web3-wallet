import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChainBadgeIcon from "./ChainBadgeIcon";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/ChainIcon/ChainIcon",
  () => () => <div>Mocked Chain Icon</div>,
);

describe("ChainBadgeIcon", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ChainBadgeIcon />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the chain badge icon", () => {
    renderComponent(
      mockedStore({
        zondStore: {
          zondConnection: {
            isLoading: false,
            isConnected: true,
            blockchain: {
              chainName: "Test Chain Name",
              defaultIconUrl: "http://testIconUrl",
            },
          },
        },
      }),
    );

    expect(screen.getByText("Mocked Chain Icon")).toBeInTheDocument();
    expect(screen.queryByTestId("loader-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("wifi-off-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("link-icon")).not.toBeInTheDocument();
  });

  it("should render the loader if the chain is loading", () => {
    renderComponent(
      mockedStore({
        zondStore: {
          zondConnection: {
            isLoading: true,
          },
        },
      }),
    );

    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("wifi-off-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("link-icon")).not.toBeInTheDocument();
  });

  it("should render the not connected icon if the chain is not connected", () => {
    renderComponent(
      mockedStore({
        zondStore: {
          zondConnection: {
            isConnected: false,
          },
        },
      }),
    );

    expect(screen.queryByTestId("loader-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("wifi-off-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("link-icon")).not.toBeInTheDocument();
  });
});

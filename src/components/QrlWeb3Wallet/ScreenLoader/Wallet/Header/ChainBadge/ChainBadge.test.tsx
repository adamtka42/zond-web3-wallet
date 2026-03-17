import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { ROUTES } from "@/router/router";
import ChainBadge from "./ChainBadge";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Header/ChainBadge/ChainBadgeIcon/ChainBadgeIcon",
  () => ({ default: () => <div>Mocked Chain Badge Icon</div> }),
);

const { mockedUseLocation } = vi.hoisted(() => ({
  mockedUseLocation: vi.fn(() => ({ pathname: "/" })),
}));
vi.mock("react-router-dom", async () => {
  const originalModule =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useLocation: () => mockedUseLocation,
  };
});

describe("ChainBadge", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof ChainBadge> = {
      displayChainName: true,
      isDisabled: false,
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <ChainBadge {...mockedProps} />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the badge button", () => {
    renderComponent(
      mockedStore({
        qrlStore: {
          qrlConnection: {
            isLoading: false,
            isConnected: true,
            blockchain: { chainName: "Test Chain Name" },
          },
        },
      }),
    );

    const link = screen.getByRole("link", {
      name: "Mocked Chain Badge Icon Test Chain Name",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", ROUTES.CHAIN_CONNECTIVITY);
    const button = screen.getByRole("button", {
      name: "Mocked Chain Badge Icon Test Chain Name",
    });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
    expect(screen.getByText("Mocked Chain Badge Icon")).toBeInTheDocument();
    expect(screen.getByText("Test Chain Name")).toBeInTheDocument();
  });

  it("should be disabled if the badge is in loading state", () => {
    renderComponent(
      mockedStore({
        qrlStore: {
          qrlConnection: {
            isLoading: true,
            blockchain: { chainName: "Test Chain Name" },
          },
        },
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Mocked Chain Badge Icon Test Chain Name",
      }),
    ).toBeDisabled();
  });

  it("should not display the chain name if displayChainName is false", () => {
    renderComponent(
      mockedStore({
        qrlStore: {
          qrlConnection: {
            isLoading: true,
            blockchain: { chainName: "Test Chain Name" },
          },
        },
      }),
      { displayChainName: false },
    );

    expect(screen.queryByText("Test Chain Name")).not.toBeInTheDocument();
  });
});

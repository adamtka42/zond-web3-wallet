import { mockedStore } from "@/__mocks__/mockedStore";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { ROUTES } from "@/router/router";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ActiveChain from "./ActiveChain";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/ChainIcon/ChainIcon",
  () => () => <div>Mocked Chain Icon</div>,
);

describe("ActiveChain", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <ActiveChain />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the active chain component", () => {
    renderComponent();

    expect(screen.getByText("Active chain")).toBeInTheDocument();
    expect(screen.getByText("Mocked Chain Icon")).toBeInTheDocument();
    expect(screen.getByText("Zond Mainnet")).toBeInTheDocument();
    expect(screen.getByText("Chain ID 1")).toBeInTheDocument();
    expect(screen.getByText("http://127.0.0.1:8545")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Edit chain" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", ROUTES.ADD_EDIT_CHAIN);
    const editChainButton = screen.getByRole("button", { name: "Edit chain" });
    expect(editChainButton).toBeInTheDocument();
  });
});

import { mockedStore } from "@/__mocks__/mockedStore";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { ROUTES } from "@/router/router";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DAppBadge from "./DAppBadge";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/DAppBadge/DAppBadgeIcon/DAppBadgeIcon",
  () => () => <div>Mocked DApp Badge Icon</div>,
);

describe("DAppBadge", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <DAppBadge />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the dapp badge", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: { hasDAppConnected: true },
      }),
    );

    const link = screen.getByRole("link", {
      name: "Mocked DApp Badge Icon",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", ROUTES.DAPP_CONNECTIVITY);
    const button = screen.getByRole("button", {
      name: "Mocked DApp Badge Icon",
    });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
    expect(screen.getByText("Mocked DApp Badge Icon")).toBeInTheDocument();
  });
});

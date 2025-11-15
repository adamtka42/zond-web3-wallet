import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import Header from "./Header";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/ZondWeb3WalletLogo/ZondWeb3WalletLogo",
  () => () => <div>Mocked Zond Web3 Wallet Logo</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/AccountBadge/AccountBadge",
  () => () => <div>Mocked Account Badge</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/ChainBadge/ChainBadge",
  () => () => <div>Mocked Chain Badge</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/DAppBadge/DAppBadgeIcon/DAppBadgeIcon",
  () => () => <div>Mocked DApp Badge</div>,
);

describe("Header", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <Header />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the zond web3 wallet logo, account badge, chain badge and dapp badge components", async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Mocked Zond Web3 Wallet Logo"),
      ).toBeInTheDocument();
      expect(screen.getByText("Mocked Account Badge")).toBeInTheDocument();
      expect(screen.getByText("Mocked Chain Badge")).toBeInTheDocument();
      expect(screen.getByText("Mocked DApp Badge")).toBeInTheDocument();
    });
  });
});

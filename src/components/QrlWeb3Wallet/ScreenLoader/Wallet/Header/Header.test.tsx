import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import Header from "./Header";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Header/QrlWeb3WalletLogo/QrlWeb3WalletLogo",
  () => ({ default: () => <div>Mocked Qrl Web3 Wallet Logo</div> }),
);
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Header/AccountBadge/AccountBadge",
  () => ({ default: () => <div>Mocked Account Badge</div> }),
);
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Header/ChainBadge/ChainBadge",
  () => ({ default: () => <div>Mocked Chain Badge</div> }),
);
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Header/DAppBadge/DAppBadgeIcon/DAppBadgeIcon",
  () => ({ default: () => <div>Mocked DApp Badge</div> }),
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

  it("should render the qrl web3 wallet logo, account badge, chain badge and dapp badge components", async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Mocked Qrl Web3 Wallet Logo"),
      ).toBeInTheDocument();
      expect(screen.getByText("Mocked Account Badge")).toBeInTheDocument();
      expect(screen.getByText("Mocked Chain Badge")).toBeInTheDocument();
      expect(screen.getByText("Mocked DApp Badge")).toBeInTheDocument();
    });
  });
});

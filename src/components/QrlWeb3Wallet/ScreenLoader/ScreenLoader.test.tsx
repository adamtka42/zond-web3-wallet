import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScreenLoader from "./ScreenLoader";

vi.mock("@/components/QrlWeb3Wallet/ScreenLoader/ScreenLoader", () => ({
  default: () => <div>Mocked Screen Loading</div>,
}));
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/DAppRequest/DAppRequest",
  () => ({ default: () => <div>Mocked DApp Request</div> }),
);
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Wallet",
  () => ({ default: () => <div>Mocked Wallet</div> }),
);

describe("ScreenLoader", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ScreenLoader />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the loading screen initially", async () => {
    renderComponent();

    waitFor(() => {
      expect(screen.getByText("Mocked Screen Loading")).toBeInTheDocument();
      expect(screen.queryByText("Mocked DApp Request")).not.toBeInTheDocument();
      expect(screen.queryByText("Mocked Wallet")).not.toBeInTheDocument();
    });
  });

  it("should render the dapp request screen if there is a dapp request", async () => {
    renderComponent(
      mockedStore({ dAppRequestStore: { hasDAppRequest: true } }),
    );

    waitFor(() => {
      expect(
        screen.queryByText("Mocked Screen Loading"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Mocked DApp Request")).toBeInTheDocument();
      expect(screen.queryByText("Mocked Wallet")).not.toBeInTheDocument();
    });
  });

  it("should render the wallet screen if there is no dapp request", async () => {
    renderComponent(
      mockedStore({ dAppRequestStore: { hasDAppRequest: false } }),
    );

    waitFor(() => {
      expect(
        screen.queryByText("Mocked Screen Loading"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Mocked DApp Request")).not.toBeInTheDocument();
      expect(screen.getByText("Mocked Wallet")).toBeInTheDocument();
    });
  });
});

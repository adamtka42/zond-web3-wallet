import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Wallet from "./Wallet";

vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/Header",
  () => ({ default: () => <div>Mocked Header</div> }),
);
vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Body",
  () => ({ default: () => <div>Mocked Body</div> }),
);

describe("Wallet", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <Wallet />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the wallet component", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Mocked Header")).toBeInTheDocument();
      expect(screen.getByText("Mocked Body")).toBeInTheDocument();
    });
  });
});

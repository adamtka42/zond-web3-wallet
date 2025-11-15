import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Wallet from "./Wallet";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/Header",
  () => () => <div>Mocked Header</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Body",
  () => () => <div>Mocked Body</div>,
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

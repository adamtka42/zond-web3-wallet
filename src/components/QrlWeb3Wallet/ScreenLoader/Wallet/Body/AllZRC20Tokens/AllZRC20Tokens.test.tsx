import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AllZRC20Tokens from "./AllZRC20Tokens";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/Home/AccountCreateImport/ActiveAccountDisplay/TokensCardContent/ZRC20Tokens/ZRC20Tokens",
  () => ({ default: () => <div>Mocked ZRC 20 tokens</div> }),
);

describe("AllZRC20Tokens", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AllZRC20Tokens />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the all zrc 20 tokens component", () => {
    renderComponent();

    expect(screen.getByText("All ZRC 20 tokens")).toBeInTheDocument();
    expect(screen.getByText("Mocked ZRC 20 tokens")).toBeInTheDocument();
  });
});

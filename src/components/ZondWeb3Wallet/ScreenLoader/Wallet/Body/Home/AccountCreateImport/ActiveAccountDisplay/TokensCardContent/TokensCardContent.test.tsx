import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TokensCardContent from "./TokensCardContent";

vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Home/AccountCreateImport/ActiveAccountDisplay/TokensCardContent/NativeToken/NativeToken",
  () => ({ default: () => <div>Mocked Native token</div> }),
);
vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Home/AccountCreateImport/ActiveAccountDisplay/TokensCardContent/ZRC20Tokens/ZRC20Tokens",
  () => ({ default: () => <div>Mocked ZRC 20 token</div> }),
);

describe("TokensCardContent", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TokensCardContent />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the token card content component", () => {
    renderComponent();

    expect(screen.getByText("Mocked Native token")).toBeInTheDocument();
    expect(screen.getByText("Mocked ZRC 20 token")).toBeInTheDocument();
  });
});

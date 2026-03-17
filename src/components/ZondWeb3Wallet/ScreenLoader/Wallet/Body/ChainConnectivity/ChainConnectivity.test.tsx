import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChainConnectivity from "./ChainConnectivity";

vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/NewChain/NewChain",
  () => ({ default: () => <div>Mocked New Chain</div> }),
);
vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/ActiveChain/ActiveChain",
  () => ({ default: () => <div>Mocked Active Chain</div> }),
);
vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/OtherChains/OtherChains",
  () => ({ default: () => <div>Mocked Other Chains</div> }),
);

describe("ChainConnectivity", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ChainConnectivity />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the chain connectivity component", () => {
    renderComponent();

    expect(screen.getByText("Mocked New Chain")).toBeInTheDocument();
    expect(screen.getByText("Mocked Active Chain")).toBeInTheDocument();
    expect(screen.getByText("Mocked Other Chains")).toBeInTheDocument();
  });
});

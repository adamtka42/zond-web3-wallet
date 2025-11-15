import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChainConnectivity from "./ChainConnectivity";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/NewChain/NewChain",
  () => () => <div>Mocked New Chain</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/ActiveChain/ActiveChain",
  () => () => <div>Mocked Active Chain</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/OtherChains/OtherChains",
  () => () => <div>Mocked Other Chains</div>,
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

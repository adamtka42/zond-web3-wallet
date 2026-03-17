import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddQrlChainInfo from "./AddQrlChainInfo";

jest.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/AddQrlChainContent/AddQrlChainInfo/AddQrlChainDetails/AddQrlChainDetails",
  () => () => <div>Mocked Add Qrl Chain Details</div>,
);
jest.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/AddQrlChainContent/AddQrlChainInfo/AddQrlChainAlert/AddQrlChainAlert",
  () => () => <div>Mocked Add Qrl Chain Alert</div>,
);

describe("AddQrlChainInfo", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AddQrlChainInfo />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the add qrl chain content component", () => {
    renderComponent();

    expect(
      screen.getByText("Mocked Add Qrl Chain Details"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mocked Add Qrl Chain Alert")).toBeInTheDocument();
  });
});

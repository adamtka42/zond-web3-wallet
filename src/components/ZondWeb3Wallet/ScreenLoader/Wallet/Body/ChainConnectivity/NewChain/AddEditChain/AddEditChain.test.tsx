import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddEditChain from "./AddEditChain";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/NewChain/AddEditChain/AddEditChainForm/AddEditChainForm",
  () => () => <div>Mocked Add Edit Chain Form</div>,
);

describe("AddEditChain", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AddEditChain />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the add edit chain component", () => {
    renderComponent();

    expect(screen.getByText("Mocked Add Edit Chain Form")).toBeInTheDocument();
  });
});

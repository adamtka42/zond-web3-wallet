import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Lock from "./Lock";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Lock/LockPassword/LockPassword",
  () => () => <div>Mocked Lock Password</div>,
);

describe("Lock", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <Lock />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the loading of lock component", () => {
    renderComponent(
      mockedStore({
        lockStore: { isLoading: true },
      }),
    );

    expect(screen.getByText("Zond Web3 Wallet")).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    expect(screen.queryByText("Mocked Lock Password")).not.toBeInTheDocument();
  });

  it("should render the lock component", () => {
    renderComponent(
      mockedStore({
        lockStore: { isLoading: false },
      }),
    );

    expect(screen.getByText("Zond Web3 Wallet")).toBeInTheDocument();
    expect(screen.getByText("Mocked Lock Password")).toBeInTheDocument();
    expect(screen.queryByTestId("loader-icon")).not.toBeInTheDocument();
  });
});

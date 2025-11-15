import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

jest.mock("lucide-react", () => {
  const originalModule =
    jest.requireActual<typeof import("lucide-react")>("lucide-react");
  return {
    ...originalModule,
    Loader: () => <div>Mocked Loader</div>,
  };
});
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Home/AccountCreateImport/AccountCreateImport",
  () => () => <div>Mocked Account Create Import</div>,
);

describe("Home", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the loader component if the connection is loading", () => {
    renderComponent(
      mockedStore({ zondStore: { zondConnection: { isLoading: true } } }),
    );

    expect(screen.getByText("Mocked Loader")).toBeInTheDocument();
  });

  it("should render the account create import component if connected to the blockchain", async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Mocked Account Create Import"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Mocked Connection Failed"),
      ).not.toBeInTheDocument();
    });
  });
});

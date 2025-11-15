import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditDAppConnectedAccounts from "./EditDAppConnectedAccounts";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Shared/BackButton/BackButton",
  () => () => <div>Mocked Back Button</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/DAppConnectivity/ActiveBrowserTab/ActiveBrowserTabIcon/ActiveBrowserTabIcon",
  () => () => <div>Mocked Active Browser Tab Icon</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/PermissionRequiredContent/DAppRequestWebsite/DAppRequestFeature/ZondRequestAccount/ZondRequestAccountContent/ZondRequestAccountAccountSelection/ZondRequestAccountAccountSelection",
  () => () => <div>Mocked Zond Request Account Selection</div>,
);

describe("EditDAppConnectedAccounts", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore({
      dAppRequestStore: {
        currentTabData: {
          connectedAccounts: ["Z20B714091cF2a62DADda2847803e3f1B9D2D3779"],
        },
      },
    }),
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <EditDAppConnectedAccounts />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the edit dapp connected accounts component", async () => {
    renderComponent();

    expect(screen.getByText("Mocked Back Button")).toBeInTheDocument();
    expect(screen.getByText("Edit connected accounts")).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Active Browser Tab Icon"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Zond Request Account Selection"),
    ).toBeInTheDocument();
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeEnabled();
    const editButton = screen.getByRole("button", { name: "Edit accounts" });
    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeEnabled();
  });
});

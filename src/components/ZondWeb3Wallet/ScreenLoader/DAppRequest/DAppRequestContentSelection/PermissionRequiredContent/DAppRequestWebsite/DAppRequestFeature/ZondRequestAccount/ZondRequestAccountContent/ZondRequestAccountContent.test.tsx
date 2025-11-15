import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ZondRequestAccountContent from "./ZondRequestAccountContent";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/PermissionRequiredContent/DAppRequestWebsite/DAppRequestFeature/ZondRequestAccount/ZondRequestAccountContent/ZondRequestAccountAccountSelection/ZondRequestAccountAccountSelection",
  () => () => <div>Mocked Zond Request Account Account Selection</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/PermissionRequiredContent/DAppRequestWebsite/DAppRequestFeature/ZondRequestAccount/ZondRequestAccountContent/ZondRequestAccountBlockchainSelection/ZondRequestAccountBlockchainSelection",
  () => () => <div>Mocked Zond Request Account Blockchain Selection</div>,
);

describe("ZondRequestAccountContent", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ZondRequestAccountContent />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the zond request account content component", async () => {
    renderComponent(
      mockedStore({
        zondStore: { zondAccounts: { isLoading: false } },
        dAppRequestStore: {
          currentTabData: {
            connectedAccounts: ["Z20fB08fF1f1376A14C055E9F56df80563E16722b"],
          },
        },
      }),
    );

    const accountsTab = screen.getByRole("tab", { name: "Accounts" });
    expect(accountsTab).toBeInTheDocument();
    const blockchainsTab = screen.getByRole("tab", { name: "Blockchains" });
    expect(blockchainsTab).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Zond Request Account Account Selection"),
    ).toBeInTheDocument();
    await userEvent.click(blockchainsTab);
    expect(
      screen.getByText("Mocked Zond Request Account Blockchain Selection"),
    ).toBeInTheDocument();
  });
});

import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WalletSendCallsContent from "./WalletSendCallsContent";
import userEvent from "@testing-library/user-event";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/WalletSendCallsContent/WalletSendCallsInfo/WalletSendCallsInfo",
  () => () => <div>Mocked Wallet Send Calls Info</div>,
);

describe("WalletSendCallsContent", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <WalletSendCallsContent />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the wallet send calls content component", () => {
    renderComponent();

    expect(screen.getByText("Add transactions")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Here is a request to add the following transactions to the blockchain.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Wallet Send Calls Info"),
    ).toBeInTheDocument();
    expect(screen.getByText("Using Smart Account")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This transaction will be delegated to a smart contract. You may check the status of the transaction using the wallet_getCallsStatus call.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Do you want to add transactions to chain?"),
    ).toBeInTheDocument();
    const noButton = screen.getByRole("button", { name: "No" });
    expect(noButton).toBeInTheDocument();
    expect(noButton).toBeEnabled();
    const yesButton = screen.getByRole("button", { name: "Yes" });
    expect(yesButton).toBeInTheDocument();
    expect(yesButton).toBeEnabled();
  });

  it("should call onPermission with false if request is rejected", async () => {
    const mockedOnPermission = jest.fn(async () => {});
    renderComponent(
      mockedStore({ dAppRequestStore: { onPermission: mockedOnPermission } }),
    );

    const noButton = screen.getByRole("button", { name: "No" });
    expect(noButton).toBeInTheDocument();
    expect(noButton).toBeEnabled();
    await userEvent.click(noButton);
    expect(mockedOnPermission).toHaveBeenCalledTimes(1);
    expect(mockedOnPermission).toHaveBeenCalledWith(false);
  });

  it("should call onPermission with true if request is approved", async () => {
    const mockedOnPermission = jest.fn(async () => {});
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          onPermission: mockedOnPermission,
          canProceed: true,
        },
      }),
    );

    const yesButton = screen.getByRole("button", { name: "Yes" });
    expect(yesButton).toBeInTheDocument();
    expect(yesButton).toBeEnabled();
    await userEvent.click(yesButton);
    expect(mockedOnPermission).toHaveBeenCalledTimes(1);
    expect(mockedOnPermission).toHaveBeenCalledWith(true);
  });
});

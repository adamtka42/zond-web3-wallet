import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Bytes } from "@theqrl/web3";
import { MemoryRouter } from "react-router-dom";
import TokenTransfer from "./TokenTransfer";

jest.mock("@theqrl/web3", () => {
  const originalModule =
    jest.requireActual<typeof import("@theqrl/web3")>("@theqrl/web3");
  return {
    ...originalModule,
    validator: { isAddressString: jest.fn(() => true) },
  };
});

let mockGetTransactionValues = jest.fn<any>().mockResolvedValue({
  receiverAddress: "",
  amount: 0,
});
let mockSetTransactionValues = jest.fn<any>().mockResolvedValue(undefined);
let mockClearTransactionValues = jest.fn<any>().mockResolvedValue(undefined);

jest.mock("@/utilities/storageUtil", () => {
  return {
    __esModule: true,
    default: {
      getTransactionValues: (...args: any[]) =>
        mockGetTransactionValues(...args),
      setTransactionValues: (...args: any[]) =>
        mockSetTransactionValues(...args),
      clearTransactionValues: (...args: any[]) =>
        mockClearTransactionValues(...args),
    },
  };
});

const successReceipt = {
  status: 1,
  transactionHash: "0xtxhash",
  transactionIndex: 1,
  blockHash: 2 as unknown as Bytes,
  blockNumber: 1,
  from: "",
  to: "",
  gasUsed: 0,
  cumulativeGasUsed: 0,
  logs: [],
  logsBloom: "",
  root: "",
};

describe("TokenTransfer", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mockGetTransactionValues.mockResolvedValue({
      receiverAddress: "",
      amount: 0,
    });
    mockSetTransactionValues.mockResolvedValue(undefined);
    mockClearTransactionValues.mockResolvedValue(undefined);
  });

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TokenTransfer />
        </MemoryRouter>
      </StoreProvider>,
    );

  const renderComponentWithState = (
    state: Record<string, any>,
    mockedStoreValues = mockedStore(),
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter
          initialEntries={[{ pathname: "/token-transfer", state }]}
        >
          <TokenTransfer />
        </MemoryRouter>
      </StoreProvider>,
    );

  const fillAndSubmitForm = async (buttonName = "Send ZND") => {
    const receiverAddressField = screen.getByRole("textbox", {
      name: "receiverAddress",
    });
    const amountField = screen.getByRole("spinbutton", { name: "amount" });
    await waitFor(
      async () => {
        await userEvent.type(
          receiverAddressField,
          "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
        );
        await userEvent.type(amountField, "2.5");
      },
      { timeout: 5000 },
    );
    const sendButton = screen.getByRole("button", { name: buttonName });
    expect(sendButton).toBeEnabled();
    await act(async () => {
      await userEvent.click(sendButton);
    });
  };

  it("should render the account details component", () => {
    renderComponent();

    expect(screen.getByText("Active account")).toBeInTheDocument();
    expect(screen.getByText("Account address")).toBeInTheDocument();
    expect(
      screen.getByText("Z 20B71 4091c F2a62 DADda 28478 03e3f 1B9D2 D3779"),
    ).toBeInTheDocument();
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("0.0 ZND")).toBeInTheDocument();
    expect(screen.getByText("Make a transaction")).toBeInTheDocument();
    expect(screen.getByText("Send to")).toBeInTheDocument();
    const receiverAddressField = screen.getByRole("textbox", {
      name: "receiverAddress",
    });
    expect(receiverAddressField).toBeInTheDocument();
    expect(receiverAddressField).toBeEnabled();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    const amountField = screen.getByRole("spinbutton", { name: "amount" });
    expect(amountField).toBeInTheDocument();
    expect(amountField).toBeEnabled();
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeEnabled();
    const sendQuantaButton = screen.getByRole("button", {
      name: "Send ZND",
    });
    expect(sendQuantaButton).toBeInTheDocument();
    expect(sendQuantaButton).toBeDisabled();
  });

  it("should enable the send quanta button once receiver address, amount and mnemonic phrases are entered", async () => {
    renderComponent();

    const receiverAddressField = screen.getByRole("textbox", {
      name: "receiverAddress",
    });
    const amountField = screen.getByRole("spinbutton", { name: "amount" });
    await waitFor(
      async () => {
        await userEvent.type(
          receiverAddressField,
          "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
        );
        await userEvent.type(amountField, "2.5");
      },
      { timeout: 5000 },
    );
    const sendQuantaButton = screen.getByRole("button", {
      name: "Send ZND",
    });
    expect(sendQuantaButton).toBeInTheDocument();
    expect(sendQuantaButton).toBeEnabled();
  });

  it("should display the error message if amount is not valid", async () => {
    renderComponent();

    const amountField = screen.getByRole("spinbutton", { name: "amount" });
    await waitFor(async () => {
      await userEvent.type(amountField, "-2.5");
    });
    expect(
      screen.getByText("Amount should be more than 0"),
    ).toBeInTheDocument();
  });

  it("should display the transaction successful component for Ledger account", async () => {
    const mockSendSignedTransaction = jest.fn<any>().mockResolvedValue({
      ...successReceipt,
      transactionHash: "0xledgertxhash",
    });

    renderComponent(
      mockedStore({
        ledgerStore: {
          isLedgerAccount: () => true,
          signAndSerializeTransaction: async () => "0x02signed",
        } as any,
        zondStore: {
          zondInstance: {
            getTransactionCount: async () => 0,
            getChainId: async () => 1,
            sendSignedTransaction: mockSendSignedTransaction,
          } as any,
        },
      }),
    );

    await fillAndSubmitForm();
    expect(screen.getByText("Transaction completed")).toBeInTheDocument();
    expect(mockSendSignedTransaction).toHaveBeenCalledWith("0x02signed");
  });

  it("should display error when Ledger signing fails", async () => {
    renderComponent(
      mockedStore({
        ledgerStore: {
          isLedgerAccount: () => true,
          signAndSerializeTransaction: async () => {
            throw new Error("User rejected on device");
          },
        } as any,
        zondStore: {
          zondInstance: {
            getTransactionCount: async () => 0,
            getChainId: async () => 1,
          } as any,
        },
      }),
    );

    await fillAndSubmitForm();
    expect(
      screen.getByText(/User rejected on device/),
    ).toBeInTheDocument();
  });

  it("should display the transaction successful component if the transaction succeeds", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          signAndSendNativeToken: async () => ({
            transactionReceipt: successReceipt,
            error: "",
          }),
        },
      }),
    );

    await fillAndSubmitForm();
    expect(screen.getByText("Transaction completed")).toBeInTheDocument();
  });

  it("should navigate home when cancel button is clicked", async () => {
    renderComponent();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await act(async () => {
      await userEvent.click(cancelButton);
    });
    expect(mockClearTransactionValues).toHaveBeenCalled();
  });

  it("should display error when transaction fails with non-success status", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          signAndSendNativeToken: async () => ({
            transactionReceipt: { ...successReceipt, status: 0 },
            error: "",
          }),
        },
      }),
    );

    await fillAndSubmitForm();
    expect(screen.getByText("Transaction failed.")).toBeInTheDocument();
  });

  it("should display error when onSubmit throws an exception", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          signAndSendNativeToken: async () => {
            throw new Error("Network timeout");
          },
        },
      }),
    );

    await fillAndSubmitForm();
    expect(screen.getByText(/Network timeout/)).toBeInTheDocument();
  });

  it("should send ZRC20 token when token details are set from state", async () => {
    const mockSignAndSendZrc20Token = jest.fn<any>().mockResolvedValue({
      transactionReceipt: successReceipt,
      error: "",
    });

    renderComponentWithState(
      {
        tokenDetails: {
          isZrc20Token: true,
          tokenContractAddress: "Z1234567890abcdef1234567890abcdef12345678",
          tokenDecimals: 18,
          tokenImage: "token.png",
          tokenBalance: "100.0",
          tokenName: "Test Token",
          tokenSymbol: "TST",
        },
      },
      mockedStore({
        zondStore: {
          signAndSendZrc20Token: mockSignAndSendZrc20Token,
        },
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Send TST")).toBeInTheDocument();
    });

    await fillAndSubmitForm("Send TST");
    expect(mockSignAndSendZrc20Token).toHaveBeenCalled();
    expect(screen.getByText("Transaction completed")).toBeInTheDocument();
  });

  it("should load token details from storage when no state is provided", async () => {
    mockGetTransactionValues.mockResolvedValue({
      receiverAddress: "",
      amount: 0,
      tokenDetails: {
        isZrc20Token: true,
        tokenContractAddress: "Zabcdef1234567890abcdef1234567890abcdef12",
        tokenDecimals: 8,
        tokenImage: "stored-token.png",
        tokenBalance: "200.0",
        tokenName: "Stored Token",
        tokenSymbol: "STK",
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Send STK")).toBeInTheDocument();
    });
  });

  it("should reset form when shouldStartFresh state is true", async () => {
    renderComponentWithState({ shouldStartFresh: true });

    await waitFor(() => {
      expect(mockClearTransactionValues).toHaveBeenCalled();
    });
  });
});

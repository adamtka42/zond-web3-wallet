import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
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

describe("TokenTransfer", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TokenTransfer />
        </MemoryRouter>
      </StoreProvider>,
    );

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

  it("should display the transaction successful component if the transaction succeeds", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          signAndSendNativeToken: async (
            from: string,
            to: string,
            value: number,
            mnemonicPhrases: string,
          ) => {
            from;
            to;
            value;
            mnemonicPhrases;
            return {
              transactionReceipt: {
                status: 1,
                transactionHash: "",
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
              },
              error: "",
            };
          },
        },
      }),
    );

    const receiverAddressField = screen.getByRole("textbox", {
      name: "receiverAddress",
    });
    const amountField = screen.getByRole("spinbutton", { name: "amount" });
    await waitFor(async () => {
      await userEvent.type(
        receiverAddressField,
        "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
      );
      await userEvent.type(amountField, "2.5");
    });
    const sendQuantaButton = screen.getByRole("button", {
      name: "Send ZND",
    });
    expect(sendQuantaButton).toBeInTheDocument();
    expect(sendQuantaButton).toBeEnabled();
    await act(async () => {
      await userEvent.click(sendQuantaButton);
    });
    expect(screen.getByText("Transaction completed")).toBeInTheDocument();
  });
});

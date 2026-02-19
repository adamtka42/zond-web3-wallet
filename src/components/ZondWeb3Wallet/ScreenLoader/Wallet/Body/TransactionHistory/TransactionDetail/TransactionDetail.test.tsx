import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import type { TransactionHistoryEntry } from "@/types/transactionHistory";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import TransactionDetail from "./TransactionDetail";

jest.mock("webextension-polyfill", () => ({
  __esModule: true,
  default: {
    tabs: {
      create: jest.fn(),
    },
  },
}));

const sampleTransaction: TransactionHistoryEntry = {
  id: "0xabc123def456",
  from: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
  to: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
  amount: 2.5,
  tokenSymbol: "QRL",
  tokenName: "Zond",
  isZrc20Token: false,
  tokenContractAddress: "",
  tokenDecimals: 18,
  transactionHash: "0xabc123def456",
  blockNumber: "100",
  gasUsed: "21000",
  effectiveGasPrice: "1000000000",
  status: true,
  timestamp: 1700000000000,
  chainId: "0x1",
};

describe("TransactionDetail", () => {
  afterEach(cleanup);

  const renderComponent = (
    transaction?: TransactionHistoryEntry,
    mockedStoreValues = mockedStore(),
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/transaction-detail",
              state: transaction ? { transaction } : undefined,
            },
          ]}
        >
          <TransactionDetail />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the heading", () => {
    renderComponent(sampleTransaction);

    expect(screen.getByText("Transaction Details")).toBeInTheDocument();
  });

  it("should show transaction not found when no state", () => {
    renderComponent(undefined);

    expect(screen.getByText("Transaction not found")).toBeInTheDocument();
  });

  it("should display amount and token symbol", () => {
    renderComponent(sampleTransaction);

    expect(screen.getByText("Amount")).toBeInTheDocument();
    const amountElement = screen.getByText("2.5 QRL", {
      selector: ".text-lg",
    });
    expect(amountElement).toBeInTheDocument();
  });

  it("should display Confirmed status for successful transaction", () => {
    renderComponent(sampleTransaction);

    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("should display Failed status for failed transaction", () => {
    renderComponent({ ...sampleTransaction, status: false });

    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("should display from and to addresses", () => {
    renderComponent(sampleTransaction);

    expect(
      screen.getByText("Q20B714091cF2a62DADda2847803e3f1B9D2D3779"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Q20fB08fF1f1376A14C055E9F56df80563E16722b"),
    ).toBeInTheDocument();
  });

  it("should display transaction hash", () => {
    renderComponent(sampleTransaction);

    expect(screen.getByText("0xabc123def456")).toBeInTheDocument();
  });

  it("should display block number", () => {
    renderComponent(sampleTransaction);

    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should display gas used", () => {
    renderComponent(sampleTransaction);

    expect(screen.getByText("21,000")).toBeInTheDocument();
  });

  it("should display date and time", () => {
    renderComponent(sampleTransaction);

    expect(screen.getByText("Date & Time")).toBeInTheDocument();
  });

  it("should have a back button", () => {
    renderComponent(sampleTransaction);

    expect(screen.getByTestId("backButtonTestId")).toBeInTheDocument();
  });

  it("should display copy buttons for from, to, and tx hash", () => {
    renderComponent(sampleTransaction);

    expect(screen.getByLabelText("Copy From")).toBeInTheDocument();
    expect(screen.getByLabelText("Copy To")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Copy Transaction Hash"),
    ).toBeInTheDocument();
  });

  it("should copy value to clipboard on copy button click", async () => {
    const writeText = jest.fn<any>().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    renderComponent(sampleTransaction);

    await userEvent.click(screen.getByLabelText("Copy Transaction Hash"));
    expect(writeText).toHaveBeenCalledWith("0xabc123def456");
  });

  it("should show View on Block Explorer button", () => {
    renderComponent(sampleTransaction);

    expect(screen.getByText("View on Block Explorer")).toBeInTheDocument();
  });

  it("should open block explorer on button click", async () => {
    const browser = (await import("webextension-polyfill")).default;

    renderComponent(sampleTransaction);

    await userEvent.click(screen.getByText("View on Block Explorer"));
    expect(browser.tabs.create).toHaveBeenCalled();
  });
});

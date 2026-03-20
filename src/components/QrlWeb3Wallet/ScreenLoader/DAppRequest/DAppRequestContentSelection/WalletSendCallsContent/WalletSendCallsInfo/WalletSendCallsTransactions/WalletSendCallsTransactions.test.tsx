import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import WalletSendCallsTransactions from "./WalletSendCallsTransactions";

describe("WalletSendCallsTransactions", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <WalletSendCallsTransactions />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the wallet send calls transactions component", async () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: {
            params: [
              {
                chainId: "0x1",
                calls: [
                  {
                    to: "Q208318ecd68f26726CE7C54b29CaBA94584969B6",
                    value: "0xde0b6b3a7640000",
                  },
                ],
              },
            ],
          },
        },
      }),
    );

    expect(screen.getByText("Transaction 1")).toBeInTheDocument();
    expect(screen.queryByText("To Address")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Q208318ecd68f26726CE7C54b29CaBA94584969B6"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Amount")).not.toBeInTheDocument();
    expect(screen.queryByText("1 QRL")).not.toBeInTheDocument();
    const expandButton = screen.getByRole("button", { name: "Transaction 1" });
    await userEvent.click(expandButton);
    expect(screen.getByText("To Address")).toBeInTheDocument();
    expect(
      screen.getByText("Q208318ecd68f26726CE7C54b29CaBA94584969B6"),
    ).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("1 QRL")).toBeInTheDocument();
  });
});

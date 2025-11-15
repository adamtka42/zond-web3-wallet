import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WalletSendCallsInfo from "./WalletSendCallsInfo";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/WalletSendCallsContent/WalletSendCallsInfo/WalletSendCallsTransactions/WalletSendCallsTransactions",
  () => () => <div>Mocked Wallet Send Calls Transactions</div>,
);

describe("WalletSendCallsInfo", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <WalletSendCallsInfo />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the wallet send calls info component", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: {
            params: [
              {
                chainId: "0x1",
                calls: [
                  {
                    to: "Z208318ecd68f26726CE7C54b29CaBA94584969B6",
                    value: "0xde0b6b3a7640000",
                  },
                ],
              },
            ],
          },
        },
      }),
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://localhost/mocked-fav-icon.svg");
    expect(img).toHaveAttribute("alt", "Mocked Page Title");
    expect(screen.getByText("http://localhost")).toBeInTheDocument();
    expect(screen.getByText("Mocked Page Title")).toBeInTheDocument();
    expect(screen.getByText("No. of transactions")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Chain ID")).toBeInTheDocument();
    expect(screen.getByText("0x1")).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Wallet Send Calls Transactions"),
    ).toBeInTheDocument();
  });
});

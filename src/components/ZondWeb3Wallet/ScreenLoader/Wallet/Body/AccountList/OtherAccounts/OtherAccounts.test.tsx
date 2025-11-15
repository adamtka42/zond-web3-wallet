import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import OtherAccounts from "./OtherAccounts";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/AccountId/AccountId",
  () => () => <div>Mocked Account Id</div>,
);

describe("OtherAccounts", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <OtherAccounts />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the other accounts component", () => {
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Z205046e6A6E159eD6ACedE46A36CAD6D449C80A1",
          },
          zondAccounts: {
            isLoading: false,
            accounts: [
              {
                accountAddress: "Z205046e6A6E159eD6ACedE46A36CAD6D449C80A1",
                accountBalance: "2.4568 ZND",
              },
              {
                accountAddress: "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
                accountBalance: "0.3695 ZND",
              },
            ],
          },
        },
      }),
    );

    expect(
      screen.getByText("Other accounts in the wallet"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mocked Account Id")).toBeInTheDocument();
    const switchToThisAccountButton = screen.getByRole("button", {
      name: "Switch to this account",
    });
    expect(switchToThisAccountButton).toBeInTheDocument();
    const copyButton = screen.getByRole("button", { name: "Copy Address" });
    expect(copyButton).toBeInTheDocument();
  });

  it("should call the setActiveAccount function on click of button", async () => {
    const mockedSetActiveAccount = jest.fn(async (activeAccount: string) => {
      activeAccount;
    });
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Z205046e6A6E159eD6ACedE46A36CAD6D449C80A1",
          },
          setActiveAccount: mockedSetActiveAccount,
          zondAccounts: {
            isLoading: false,
            accounts: [
              {
                accountAddress: "Z205046e6A6E159eD6ACedE46A36CAD6D449C80A1",
                accountBalance: "2.4568 ZND",
              },
              {
                accountAddress: "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
                accountBalance: "0.3695 ZND",
              },
            ],
          },
        },
      }),
    );

    const switchToThisAccountButton = screen.getByRole("button", {
      name: "Switch to this account",
    });
    expect(switchToThisAccountButton).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(switchToThisAccountButton);
    });
    expect(mockedSetActiveAccount).toBeCalledTimes(1);
  });

  it("should call the copyAccount function on clicking the copy button", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Z205046e6A6E159eD6ACedE46A36CAD6D449C80A1",
          },
          zondAccounts: {
            isLoading: false,
            accounts: [
              {
                accountAddress: "Z205046e6A6E159eD6ACedE46A36CAD6D449C80A1",
                accountBalance: "2.4568 ZND",
              },
              {
                accountAddress: "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
                accountBalance: "0.3695 ZND",
              },
            ],
          },
        },
      }),
    );

    const mockedWriteText = jest.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockedWriteText,
      },
      writable: true,
    });
    const copyButton = screen.getByRole("button", { name: "Copy Address" });
    expect(copyButton).toBeInTheDocument();
    await userEvent.click(copyButton);
    expect(mockedWriteText).toBeCalledTimes(1);
    expect(mockedWriteText).toBeCalledWith(
      "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
    );
  });
});

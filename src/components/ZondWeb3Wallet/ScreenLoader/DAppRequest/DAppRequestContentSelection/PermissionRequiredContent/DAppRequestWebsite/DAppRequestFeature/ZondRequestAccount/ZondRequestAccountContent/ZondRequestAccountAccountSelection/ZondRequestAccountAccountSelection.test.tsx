import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ZondRequestAccountAccountSelection from "./ZondRequestAccountAccountSelection";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/AccountId/AccountId",
  () => () => <div>Mocked Account ID</div>,
);

describe("ZondRequestAccountAccountSelection", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof ZondRequestAccountAccountSelection> = {
      onAccountSelection: () => {},
      selectedAccounts: [],
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ZondRequestAccountAccountSelection {...mockedProps} />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the zond request account account selection component", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          zondAccounts: {
            isLoading: false,
            accounts: [
              {
                accountAddress: "Z20E7Bde67f00EA38ABb2aC57e1B0DD93f518446c",
                accountBalance: "0.0 ZND",
              },
            ],
          },
        },
      }),
    );

    expect(
      screen.getByText(
        "Select the accounts you want this site to connect with",
      ),
    ).toBeInTheDocument();
    const checkBox = screen.getByRole("checkbox", {
      name: "accountsCheckbox",
    });
    expect(checkBox).toBeInTheDocument();
    expect(checkBox).toBeEnabled();
    expect(screen.getByText("Mocked Account ID")).toBeInTheDocument();
  });

  it("should display the message is no accounts are available", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          zondAccounts: {
            isLoading: false,
            accounts: [],
          },
        },
      }),
    );

    expect(
      screen.getByText("No accounts available to connect"),
    ).toBeInTheDocument();
  });

  it("should call the account selection callback on clicking checkbox", async () => {
    const mockedOnAccountSelection = jest.fn(() => {});
    renderComponent(
      mockedStore({
        zondStore: {
          zondAccounts: {
            isLoading: false,
            accounts: [
              {
                accountAddress: "Z20E7Bde67f00EA38ABb2aC57e1B0DD93f518446c",
                accountBalance: "0.0 ZND",
              },
            ],
          },
        },
      }),
      { selectedAccounts: [], onAccountSelection: mockedOnAccountSelection },
    );

    const checkBox = screen.getByRole("checkbox", {
      name: "accountsCheckbox",
    });
    expect(checkBox).toBeInTheDocument();
    expect(checkBox).toBeEnabled();
    await userEvent.click(checkBox);
    expect(mockedOnAccountSelection).toHaveBeenCalledTimes(1);
  });
});

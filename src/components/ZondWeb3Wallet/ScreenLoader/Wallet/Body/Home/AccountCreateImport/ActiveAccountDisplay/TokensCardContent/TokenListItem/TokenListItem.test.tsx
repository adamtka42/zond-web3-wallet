import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import TokenListItem from "./TokenListItem";

jest.mock("@/utilities/storageUtil", () => {
  const originalModule = jest.requireActual<
    typeof import("@/utilities/storageUtil")
  >("@/utilities/storageUtil");
  return {
    ...originalModule,
    clearFromTokenContractsList: jest.fn(async () => {}),
  };
});
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Home/AccountCreateImport/ActiveAccountDisplay/TokensCardContent/TokenListItem/TokenListItemIcon/TokenListItemIcon",
  () => () => <div>Mocked Token List Item Icon</div>,
);

describe("TokenListItem", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof TokenListItem> = {
      balance: "25 ZND",
      name: "ZND TOKEN",
      symbol: "ZND",
      contractAddress: "Z0db3981cb93db985e4e3a62ff695f7a1b242dd7c",
      decimals: 18,
      isZrc20Token: false,
      image: "",
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <TokenListItem {...mockedProps} />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the token list item component", () => {
    renderComponent();

    expect(screen.getByText("25 ZND")).toBeInTheDocument();
    expect(screen.getByText("ZND TOKEN")).toBeInTheDocument();
    const moreButton = screen.getByRole("button", { name: "More" });
    expect(moreButton).toBeInTheDocument();
    expect(moreButton).toBeEnabled();
  });

  it("should disable the hide token button if the token is not ZRC 20", async () => {
    renderComponent(mockedStore(), {
      isZrc20Token: false,
      image: "",
      balance: "",
      name: "",
      symbol: "",
    });

    const moreButton = screen.getByRole("button", { name: "More" });
    expect(moreButton).toBeInTheDocument();
    expect(moreButton).toBeEnabled();
    await userEvent.click(moreButton);
    const hideButton = screen.getByRole("button", { name: "Hide Token" });
    expect(hideButton).toBeInTheDocument();
    expect(hideButton).toBeDisabled();
  });

  it("should hide the token on clicking the hide token button", async () => {
    const mockedTriggerReRender = jest.fn(() => {});
    renderComponent(mockedStore(), {
      isZrc20Token: true,
      image: "",
      balance: "",
      name: "",
      symbol: "TST",
      triggerReRender: mockedTriggerReRender,
    });

    const moreButton = screen.getByRole("button", { name: "More" });
    expect(moreButton).toBeInTheDocument();
    expect(moreButton).toBeEnabled();
    await userEvent.click(moreButton);
    const hideButton = screen.getByRole("button", { name: "Hide Token" });
    expect(hideButton).toBeInTheDocument();
    expect(hideButton).toBeEnabled();
    await userEvent.click(hideButton);
    expect(screen.getByText("Hide")).toBeInTheDocument();
    expect(
      screen.getByText("Do you want to hide 'TST' from wallet?"),
    ).toBeInTheDocument();
    const noButton = screen.getByRole("button", { name: "Cancel Hide" });
    expect(noButton).toBeInTheDocument();
    expect(noButton).toBeEnabled();
    const yesButton = screen.getByRole("button", { name: "Confirm Hide" });
    expect(yesButton).toBeInTheDocument();
    expect(yesButton).toBeEnabled();
    await userEvent.click(yesButton);
    expect(mockedTriggerReRender).toHaveBeenCalledTimes(1);
  });
});

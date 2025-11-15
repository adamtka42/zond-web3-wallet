import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { ROUTES } from "@/router/router";
import ActiveAccount from "./ActiveAccount";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/AccountId/AccountId",
  () => () => <div>Mocked Account Id</div>,
);

describe("ActiveAccount", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <ActiveAccount />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the active account component", () => {
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
          },
        },
      }),
    );

    expect(screen.getByText("Active account")).toBeInTheDocument();
    expect(screen.getByText("Mocked Account Id")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Send Quanta" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", ROUTES.TOKEN_TRANSFER);
    const sendQuantaButton = screen.getByRole("button", {
      name: "Send Quanta",
    });
    expect(sendQuantaButton).toBeInTheDocument();
    const copyButton = screen.getByRole("button", { name: "Copy Address" });
    expect(copyButton).toBeInTheDocument();
  });

  it("should call the copyAccount function on clicking the copy button", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
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

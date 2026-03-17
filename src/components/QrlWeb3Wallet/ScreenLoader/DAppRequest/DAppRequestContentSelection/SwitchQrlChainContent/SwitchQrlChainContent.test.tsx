import { mockedStore } from "@/__mocks__/mockedStore";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SwitchQrlChainContent from "./SwitchQrlChainContent";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/SwitchQrlChainContent/SwitchQrlChainInfo/SwitchQrlChainInfo",
  () => ({ default: () => <div>Mocked Switch Qrl Chain Info</div> }),
);

describe("SwitchQrlChainContent", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <SwitchQrlChainContent />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the switch qrl chain content component", async () => {
    renderComponent();

    expect(screen.getByText("Switch chain")).toBeInTheDocument();
    expect(
      screen.getByText("Here is a request to switch the current blockchain."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Switch Qrl Chain Info"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Do you want to switch the chain?"),
    ).toBeInTheDocument();
    const noButton = screen.getByRole("button", { name: "No" });
    const yesButton = screen.getByRole("button", { name: "Yes" });
    expect(noButton).toBeInTheDocument();
    expect(noButton).toBeEnabled();
    expect(yesButton).toBeInTheDocument();
    expect(yesButton).toBeEnabled();
  });

  it("should call onPermission with false if request is rejected", async () => {
    const mockedOnPermission = vi.fn(async () => {});
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
    const mockedOnPermission = vi.fn(async () => {});
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

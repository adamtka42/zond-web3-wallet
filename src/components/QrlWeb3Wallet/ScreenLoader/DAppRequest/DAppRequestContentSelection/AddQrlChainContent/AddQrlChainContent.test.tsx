import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import AddQrlChainContent from "./AddQrlChainContent";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/AddQrlChainContent/AddQrlChainInfo/AddQrlChainInfo",
  () => ({ default: () => <div>Mocked Add Qrl Chain Info</div> }),
);

describe("AddQrlChainContent", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AddQrlChainContent />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the add qrl chain content component", () => {
    renderComponent();

    expect(screen.getByText("Add new chain")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Here is a request to add the following blockchain to the wallet.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Mocked Add Qrl Chain Info")).toBeInTheDocument();
    expect(
      screen.getByText("Do you want to add this chain?"),
    ).toBeInTheDocument();
    const noButton = screen.getByRole("button", { name: "No" });
    expect(noButton).toBeInTheDocument();
    expect(noButton).toBeEnabled();
    const yesButton = screen.getByRole("button", { name: "Yes" });
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

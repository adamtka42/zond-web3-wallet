import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import DAppRequest from "./DAppRequest";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Header/ChainBadge/ChainBadge",
  () => ({ default: () => <div>Mocked ChainBadge</div> }),
);

describe("DAppRequest", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <DAppRequest />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the dapp request content component", async () => {
    renderComponent();

    expect(screen.getByText("Mocked ChainBadge")).toBeInTheDocument();
    expect(screen.getByText("Your permission required")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Here is a request coming in. Go through the details and decide if it needs to be allowed.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Do you trust and want to allow this?"),
    ).toBeInTheDocument();
    const noButton = screen.getByRole("button", { name: "No" });
    const yesButton = screen.getByRole("button", { name: "Yes" });
    expect(noButton).toBeInTheDocument();
    expect(yesButton).toBeInTheDocument();
    expect(noButton).toBeEnabled();
    expect(yesButton).toBeDisabled();
  });
});

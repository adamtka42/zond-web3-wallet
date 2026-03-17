import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import NativeToken from "./NativeToken";

describe("NativeToken", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <NativeToken />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the native token component", () => {
    renderComponent();

    expect(screen.getByText("0.0 QRL")).toBeInTheDocument();
    expect(screen.getByText("Zond")).toBeInTheDocument();
    const moreButton = screen.getByRole("button", { name: "More" });
    expect(moreButton).toBeInTheDocument();
    expect(moreButton).toBeEnabled();
  });
});

import { mockedStore } from "@/__mocks__/mockedStore";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import TokenListItemIcon from "./TokenListItemIcon";

describe("TokenListItemIcon", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof TokenListItemIcon> = {
      icon: "http://testIconUrl",
      symbol: "Test Symbol",
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <TokenListItemIcon {...mockedProps} />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the token item icon component", () => {
    renderComponent();

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://testIconUrl");
    expect(img).toHaveAttribute("alt", "Test Symbol");
  });

  it("should render fallback icon if icon load fails", () => {
    renderComponent();

    const img = screen.getByRole("img");
    fireEvent.error(img);
    expect(img).toHaveClass("hidden");
    expect(screen.getByTestId("filebox-icon")).toBeInTheDocument();
  });
});

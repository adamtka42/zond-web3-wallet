import { mockedStore } from "@/__mocks__/mockedStore";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import ChainIcon from "./ChainIcon";

describe("ChainIcon", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof ChainIcon> = {
      src: "http://testIconUrl",
      alt: "Test Icon",
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <ChainIcon {...mockedProps} />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the chain icon component", () => {
    renderComponent();

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://testIconUrl");
    expect(img).toHaveAttribute("alt", "Test Icon");
  });

  it("should render fallback icon if image load fails", () => {
    renderComponent();

    const img = screen.getByRole("img");
    fireEvent.error(img);
    expect(img).toHaveClass("hidden");
    expect(screen.getByTestId("link-icon")).toBeInTheDocument();
  });
});

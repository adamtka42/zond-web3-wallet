import { mockedStore } from "@/__mocks__/mockedStore";
import { ROUTES } from "@/router/router";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NewChain from "./NewChain";

describe("NewChain", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <NewChain />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the new chain component", () => {
    renderComponent();

    expect(screen.getByText("Add a custom blockchain")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Add a custom blockchain" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", ROUTES.ADD_EDIT_CHAIN);
    const addChainButton = screen.getByRole("button", {
      name: "Add a custom blockchain",
    });
    expect(addChainButton).toBeInTheDocument();
    expect(addChainButton).toBeEnabled();
  });
});

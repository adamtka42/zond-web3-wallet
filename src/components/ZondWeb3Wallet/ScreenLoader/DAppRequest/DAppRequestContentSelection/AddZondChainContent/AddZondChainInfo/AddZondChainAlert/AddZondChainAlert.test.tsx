import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddZondChainAlert from "./AddZondChainAlert";

describe("AddZondChainAlert", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AddZondChainAlert />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the add zond chain alert component", () => {
    renderComponent();

    expect(screen.getByText("Careful!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Before adding the blockchain and making transactions, make sure you understand what you are doing.",
      ),
    ).toBeInTheDocument();
  });
});

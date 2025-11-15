import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AccountAddressDisplay from "./AccountAddressDisplay";

describe("AccountAddressDisplay", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AccountAddressDisplay />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the account address display component", () => {
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Z208318ecd68f26726CE7C54b29CaBA94584969B6",
          },
        },
      }),
    );

    expect(screen.getByText("Account address")).toBeInTheDocument();
    expect(
      screen.getByText("Z 20831 8ecd6 8f267 26CE7 C54b2 9CaBA 94584 969B6"),
    ).toBeInTheDocument();
  });
});

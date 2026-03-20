import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import AccountId from "./AccountId";

describe("AccountId", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof AccountId> = {
      account: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AccountId {...mockedProps} />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the account id component", () => {
    renderComponent(
      mockedStore({
        qrlStore: {
          getAccountBalance: () => "10.0 QRL",
        },
      }),
    );

    const addressParts = [
      "Q20fB0",
      "8fF1f",
      "1376A",
      "14C05",
      "5E9F5",
      "6df80",
      "563E1",
      "6722b",
      "10.0 QRL",
    ];
    for (const word of addressParts) {
      expect(screen.getByText(word)).toBeInTheDocument();
    }
  });
});

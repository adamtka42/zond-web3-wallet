import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import StartAccountCreation from "./StartAccountCreation";

describe("StartAccountCreation", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof StartAccountCreation> = {
      onAccountCreated: () => {},
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <StartAccountCreation {...mockedProps} />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the start account creation component", () => {
    renderComponent();

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Create a new account",
    );
    expect(
      screen.getByText(
        "You can add a new account to this wallet. After creating the account, ensure you keep the account recovery phrases safe.",
      ),
    ).toBeInTheDocument();
    const createAccountButton = screen.getByRole("button", {
      name: "Create account",
    });
    expect(createAccountButton).toBeInTheDocument();
    expect(createAccountButton).toBeEnabled();
  });

  it("should invoke the onAccountCreated method on clicking add account button", async () => {
    const mockedOnAccountCreated = jest.fn();
    renderComponent(mockedStore({}), {
      onAccountCreated: mockedOnAccountCreated,
    });

    const createAccountButton = screen.getByRole("button", {
      name: "Create account",
    });
    expect(createAccountButton).toBeInTheDocument();
    expect(createAccountButton).toBeEnabled();
    await userEvent.click(createAccountButton);
    expect(mockedOnAccountCreated).toHaveBeenCalledTimes(1);
  });
});

import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "@jest/globals";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateAccount from "./CreateAccount";

describe("CreateAccount", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <CreateAccount />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the account creation form for creating account if the account is not yet created", async () => {
    renderComponent();

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "Create a new account",
      );
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "You can add a new account to this wallet. After creating the account, ensure you keep the account recovery phrases safe.",
      );
      expect(
        screen.getByRole("button", { name: "Create account" }),
      ).toBeInTheDocument();
    });
  });

  it("should render the mnemonic display component once the account is created", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          zondInstance: {
            accounts: {
              create: () => ({
                address: "Z205046e6A6E159eD6ACedE46A36CAD6D449C80A1",
                seed: "",
                sign: (data: Record<string, unknown> | string) => {
                  data;
                  return { messageHash: "", signature: "", message: "" };
                },
                signTransaction: async () => ({
                  messageHash: "",
                  rawTransaction: "",
                  signature: "",
                  transactionHash: "",
                }),
              }),
            },
          },
        },
      }),
    );

    const createAccountButton = screen.getByRole("button", {
      name: "Create account",
    });
    await act(async () => {
      await userEvent.click(createAccountButton);
    });
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Keep this safe",
    );
    expect(screen.getByRole("paragraph")).toHaveTextContent(
      "Don't lose this mnemonic phrases. Download it right now. You may need this someday to import or recover your new account Z20504 ... C80A1",
    );
    const downloadButton = screen.getByRole("button", { name: "Download" });
    const continueButton = screen.getByRole("button", { name: "Continue" });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toBeEnabled();
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toBeEnabled();
  });

  it("should render the account creation success component once the mnemonic phrases are downloaded and confirmed", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          zondInstance: {
            accounts: {
              create: () => ({
                address: "Z205046e6A6E159eD6ACedE46A36CAD6D449C80A1",
                seed: "",
                sign: (data: Record<string, unknown> | string) => {
                  data;
                  return { messageHash: "", signature: "", message: "" };
                },
                signTransaction: async () => ({
                  messageHash: "",
                  rawTransaction: "",
                  signature: "",
                  transactionHash: "",
                }),
              }),
            },
          },
        },
      }),
    );

    const createAccountButton = screen.getByRole("button", {
      name: "Create account",
    });
    await act(async () => {
      await userEvent.click(createAccountButton);
    });
    const continueButton = screen.getByRole("button", { name: "Continue" });
    await act(async () => {
      await userEvent.click(continueButton);
    });
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Important!",
    );
    expect(screen.getByRole("paragraph")).toHaveTextContent(
      "It is highly recommended that you continue after downloading the recovery mnemonic phrases. If you already have, please continue.",
    );
    const continueConfirmButton = screen.getByRole("button", {
      name: "Continue",
    });
    await act(async () => {
      await userEvent.click(continueConfirmButton);
    });
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Account created",
    );
    expect(screen.getByText("Account public address:")).toBeInTheDocument();
    expect(
      screen.getByText("Z 20504 6e6A6 E159e D6ACe dE46A 36CAD 6D449 C80A1"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "You can share this account public address with anyone. Others need it to interact with you.",
      ),
    ).toBeInTheDocument();
    const accountCopyButton = screen.getByRole("button", { name: "Copy" });
    const accountCreationDoneButton = screen.getByRole("button", {
      name: "Done",
    });
    expect(accountCopyButton).toBeInTheDocument();
    expect(accountCopyButton).toBeEnabled();
    expect(accountCreationDoneButton).toBeInTheDocument();
    expect(accountCreationDoneButton).toBeEnabled();
  });
});

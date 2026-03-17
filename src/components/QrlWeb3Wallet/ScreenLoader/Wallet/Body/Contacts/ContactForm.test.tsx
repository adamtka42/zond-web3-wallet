import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

jest.mock("@theqrl/web3", () => ({
  validator: {
    isAddressString: (addr: string) =>
      typeof addr === "string" && addr.startsWith("Q") && addr.length >= 41,
  },
}));

describe("ContactForm", () => {
  afterEach(cleanup);

  it("should render name and address inputs", () => {
    render(<ContactForm onSave={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByPlaceholderText("Contact name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Q address")).toBeInTheDocument();
  });

  it("should render Save and Cancel buttons", () => {
    render(<ContactForm onSave={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("should call onCancel when Cancel is clicked", async () => {
    const onCancel = jest.fn<any>();
    render(<ContactForm onSave={jest.fn()} onCancel={onCancel} />);

    await userEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("should call onSave with form data on valid submit", async () => {
    const onSave = jest.fn<any>();
    render(<ContactForm onSave={onSave} onCancel={jest.fn()} />);

    const nameInput = screen.getByPlaceholderText("Contact name");
    const addressInput = screen.getByPlaceholderText("Q address");

    await userEvent.type(nameInput, "Alice");
    await userEvent.type(addressInput, "Q20B714091cF2a62DADda2847803e3f1B9D2D3779");

    const saveButton = screen.getByRole("button", { name: /Save/i });
    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    }, { timeout: 3000 });

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        name: "Alice",
        address: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
      });
    });
  });

  it("should populate fields when editing", () => {
    render(
      <ContactForm
        initialContact={{
          name: "Bob",
          address: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
        }}
        onSave={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(screen.getByPlaceholderText("Contact name")).toHaveValue("Bob");
    expect(screen.getByPlaceholderText("Q address")).toHaveValue(
      "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
    );
  });

  it("should disable address field when editing", () => {
    render(
      <ContactForm
        initialContact={{
          name: "Bob",
          address: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
        }}
        onSave={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(screen.getByPlaceholderText("Q address")).toBeDisabled();
  });

  it("should show error for duplicate address", async () => {
    render(
      <ContactForm
        existingAddresses={["Q20B714091cF2a62DADda2847803e3f1B9D2D3779"]}
        onSave={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    await userEvent.type(
      screen.getByPlaceholderText("Contact name"),
      "Duplicate",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Q address"),
      "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
    );

    await waitFor(() => {
      expect(
        screen.getByText("Contact with this address already exists"),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /Save/i })).toBeDisabled();
  });

  it("should allow editing contact without triggering duplicate for own address", async () => {
    const onSave = jest.fn<any>();
    render(
      <ContactForm
        initialContact={{
          name: "Alice",
          address: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
        }}
        existingAddresses={["Q20B714091cF2a62DADda2847803e3f1B9D2D3779"]}
        onSave={onSave}
        onCancel={jest.fn()}
      />,
    );

    // Change the name — address stays the same (disabled), should not be flagged as duplicate
    const nameInput = screen.getByPlaceholderText("Contact name");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Alice Updated");

    const saveButton = screen.getByRole("button", { name: /Save/i });
    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    }, { timeout: 3000 });

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        name: "Alice Updated",
        address: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
      });
    });
  });
});

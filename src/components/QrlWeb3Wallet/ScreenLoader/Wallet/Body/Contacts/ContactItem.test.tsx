import type { Contact } from "@/types/contact";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactItem from "./ContactItem";

describe("ContactItem", () => {
  afterEach(cleanup);

  const contact: Contact = {
    name: "Alice",
    address: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
  };

  it("should render the contact name", () => {
    render(
      <ContactItem
        contact={contact}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("should render the contact address", () => {
    render(
      <ContactItem
        contact={contact}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(
      screen.getByText(/Q20B714091cF2a62DADda2847803e3f1B9D2D3779/),
    ).toBeInTheDocument();
  });

  it("should call onEdit when edit button is clicked", async () => {
    const onEdit = jest.fn<any>();
    render(
      <ContactItem contact={contact} onEdit={onEdit} onDelete={jest.fn()} />,
    );

    await userEvent.click(screen.getByLabelText("Edit contact"));
    expect(onEdit).toHaveBeenCalledWith(contact);
  });

  it("should call onDelete when delete button is clicked", async () => {
    const onDelete = jest.fn<any>();
    render(
      <ContactItem
        contact={contact}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />,
    );

    await userEvent.click(screen.getByLabelText("Delete contact"));
    expect(onDelete).toHaveBeenCalledWith(contact.address);
  });
});

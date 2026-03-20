import type { Contact } from "@/types/contact";
import StringUtil from "@/utilities/stringUtil";
import { Pencil, Trash2 } from "lucide-react";

type ContactItemProps = {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (address: string) => void;
};

const ContactItem = ({ contact, onEdit, onDelete }: ContactItemProps) => {
  const { prefix, addressSplit } = StringUtil.getSplitAddress(contact.address);

  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div className="flex flex-col gap-1 overflow-hidden">
        <span className="text-sm font-medium">{contact.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {prefix}
          {addressSplit.join("")}
        </span>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          aria-label="Edit contact"
          className="rounded p-1 text-muted-foreground transition-colors hover:text-secondary"
          onClick={() => onEdit(contact)}
        >
          <Pencil size={14} />
        </button>
        <button
          aria-label="Delete contact"
          className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
          onClick={() => onDelete(contact.address)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default ContactItem;

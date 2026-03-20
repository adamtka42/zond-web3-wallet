import type { Contact } from "@/types/contact";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import ContactItem from "./ContactItem";

type ContactListProps = {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (address: string) => void;
};

const ContactList = ({ contacts, onEdit, onDelete }: ContactListProps) => {
  const { t } = useTranslation();

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <Users className="h-12 w-12" />
        <p className="text-sm">{t('contacts.empty')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {contacts.map((contact) => (
        <ContactItem
          key={contact.address}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ContactList;

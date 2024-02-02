import { memo } from "react";
import Icon from "../../../components/Icon"
import { Contact } from "../../../Types";

type ContactsItemsProps = {
    readonly contacts: Contact[]
}

function ContactsItems({ contacts }: ContactsItemsProps) {
    return (
        <>
            {contacts.map((contact, index) => {
                return (
                    <Icon
                        key={contact.name}
                        src={contact.imgSrc}
                        alt={contact.name}
                        text={contact.name}
                        pointer={true}
                        onClick={() => window.open(contact.link, "_blank")} />
                )
            })}
        </>
    )
}

export default memo(ContactsItems);
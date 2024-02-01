import { useEffect, useState } from "react";
import Icon from "../../../components/Icon"
import { getContacts } from '../../../APIs';
import { Contact } from "../../../Types";
import Loader from "../../../components/Loader";

export default function ListContacts() {
    const [contacts, setContacts] = useState<Contact[] | null>(null);

    useEffect(() => {
        getContacts().then((result) => {
            let newState: Contact[] = [];
            result.forEach((element) => {
                newState.push({
                    link: element.link,
                    name: element.name,
                    imgSrc: element.imgSrc,
                })
            })

            setContacts(newState);
        })
    }, []);

    return (
        <>
            {contacts ? <ContactsItems contacts={contacts} /> : <Loader />}
        </>
    )
}

function ContactsItems({ contacts }: { readonly contacts: Contact[] }) {
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

import { useEffect, useState } from "react";
import { getContacts } from '../../../APIs';
import { Contact } from "../../../Types";
import Loader from "../../../components/Loader";
import ContactsItems from "./ContactsItems";

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
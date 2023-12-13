import { useEffect, useState } from "react";
import Icon from "../../../components/Icon"
import { getContacts } from '../../../APIs';
import { Contact } from "../../../Types";

export default function ListContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);

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
            {contacts.map((project, index) => {
                return (
                    <Icon
                        key={project.name}
                        src={project.imgSrc}
                        alt={project.name}
                        text={project.name}
                        pointer={true}
                        onClick={() => window.open(project.link, "_blank")}
                    />
                )
            })}
        </>
    )
}

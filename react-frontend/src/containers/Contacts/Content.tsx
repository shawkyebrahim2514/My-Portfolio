import { memo } from "react";
import { SanityContactsPage } from "../../Types";
import Icon from "../../components/Icon";
import styles from "./Content.module.css";

function Content({ contacts }: Readonly<Pick<SanityContactsPage, "contacts">>) {
    return (
        <div className={styles.contacts}>
            {contacts.map((contact) => {
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
        </div>
    )
}

export default memo(Content)
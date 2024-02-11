import { memo } from "react";
import { SanityContactsPage } from "../../Types";
import Icon from "../../components/Icon";

function Content({ contacts }: Readonly<Pick<SanityContactsPage, "contacts">>) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
        }}>
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
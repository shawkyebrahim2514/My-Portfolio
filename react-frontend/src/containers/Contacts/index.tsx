import { CSSProperties, useMemo } from 'react'
import ContainerWrap from '../../components/ContainerWrap';
import SectionTitle from '../../components/SectionTitle';
import ListContacts from './ListContacts';
import { contactsPageContent } from '../../Texts';

function Contacts() {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    return (
        <div style={containerStyle}>
            <SectionTitle
                highlightedText={contactsPageContent.highlightedTitle}
                text={contactsPageContent.titlePhrase} />
            <SectionContent />
        </div>
    )
}

function SectionContent() {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
        }}>
            <ListContacts />
        </div>
    )
}

export default ContainerWrap(Contacts)

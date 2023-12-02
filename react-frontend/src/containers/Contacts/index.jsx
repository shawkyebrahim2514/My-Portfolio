import { useEffect, useMemo, useState } from 'react'
import ContainerWrap from '../../components/ContainerWrap';
import SectionTitle from '../../components/SectionTitle';
import Icon from '../../components/Icon';
import { getContacts } from '../../APIs';
import ListContacts from './ListContacts';

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const containerStyle = useMemo(() => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getContacts().then((result) => {
            let newState = [];
            result.forEach((element) => {
                newState.push({
                    link: element.link,
                    alt: element.name,
                    imgSrc: element.imgSrc,
                })
            })

            setContacts(newState);
        })
    }, []);

    return (
        <div style={containerStyle}>
            {/* Title */}
            <SectionTitle
                highlightedText={"Contacts"}
                text={"You can reach me through"} />

            {/* Content */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem",
                flexWrap: "wrap",
            }}>
                <ListContacts list={contacts} />
            </div>
        </div>
    )
}

export default ContainerWrap(Contacts)

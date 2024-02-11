import { CSSProperties, useEffect, useMemo, useState } from 'react'
import ContainerWrap from '../../components/ContainerWrap';
import { getContactsPage } from '../../APIs';
import { SanityContactsPage } from '../../Types';
import Loader from '../../components/Loader';
import Content from './Content';
import Title from '../Title';

function Contacts() {
    const [contactsPage, setContactsPage] = useState<SanityContactsPage | null>(null);
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getContactsPage().then((result) => {
            setContactsPage(result);
        })
    }, []);

    return (
        <>
            {contactsPage ? (
                <div style={containerStyle}>
                    <Title title={contactsPage.title} />
                    <Content contacts={contactsPage.contacts} />
                </div>
            ) : <Loader />}
        </>
    )
}

export default ContainerWrap(Contacts)

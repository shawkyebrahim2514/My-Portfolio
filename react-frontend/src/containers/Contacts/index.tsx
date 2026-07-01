import ContainerWrap from '../../components/ContainerWrap';
import { getContactsPage } from '../../APIs';
import { SanityContactsPage } from '../../Types';
import Loader from '../../components/Loader';
import SectionError from '../../components/SectionError';
import Content from './Content';
import Title from '../Title';
import { useSanityQuery } from '../../hooks/useSanityQuery';
import styles from '../../styles/section.module.css';

function Contacts() {
    const { data: contactsPage, error } = useSanityQuery<SanityContactsPage>(getContactsPage);

    if (error) return <SectionError />;
    if (!contactsPage) return <Loader />;

    return (
        <div className={styles.section}>
            <Title title={contactsPage.title} />
            <Content contacts={contactsPage.contacts} />
        </div>
    )
}

export default ContainerWrap(Contacts)

import { useData } from 'vike-react/useData';
import ContainerWrap from '../../src/components/ContainerWrap';
import Title from '../../src/containers/Title';
import Content from '../../src/containers/Contacts/Content';
import type { SanityContactsPage } from '../../src/Types';
import styles from '../../src/styles/section.module.css';

function Contacts() {
  const contactsPage = useData<SanityContactsPage>();

  return (
    <div className={styles.section}>
      <Title title={contactsPage.title} />
      <Content contacts={contactsPage.contacts} />
    </div>
  );
}

export default ContainerWrap(Contacts);

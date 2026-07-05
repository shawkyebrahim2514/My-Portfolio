import { useData } from 'vike-react/useData';
import ContainerWrap from '../../../src/components/ContainerWrap';
import EntryDetail from '../../../src/containers/Hub/EntryDetail';
import type { SanityHubEntry } from '../../../src/Types';
import styles from '../../../src/styles/section.module.css';

function HubEntryPage() {
    const entry = useData<SanityHubEntry>();

    return (
        <div className={styles.section}>
            <EntryDetail {...entry} />
        </div>
    );
}

export default ContainerWrap(HubEntryPage);

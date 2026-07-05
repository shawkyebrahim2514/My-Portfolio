import { useData } from 'vike-react/useData';
import ContainerWrap from '../../src/components/ContainerWrap';
import Title from '../../src/containers/Title';
import RichContent from '../../src/components/RichContent';
import CategoryFilters from '../../src/containers/Hub/CategoryFilters';
import Grid from '../../src/containers/Hub/Grid';
import type { HubIndexData } from './+data';
import styles from '../../src/styles/section.module.css';

function Hub() {
    const { page, entries, categories } = useData<HubIndexData>();

    return (
        <div className={styles.section}>
            <Title title={page.title} />
            <RichContent value={page.intro} />
            <CategoryFilters categories={categories} />
            <Grid entries={entries} />
        </div>
    );
}

export default ContainerWrap(Hub);

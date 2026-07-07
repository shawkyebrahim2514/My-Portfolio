import { useData } from 'vike-react/useData';
import ContainerWrap from '../../../src/components/ContainerWrap';
import EntryDetail from '../../../src/containers/Hub/EntryDetail';
import HubBreadcrumb from '../../../src/containers/Hub/HubBreadcrumb';
import HubRecommendations from '../../../src/containers/Hub/HubRecommendations';
import { cx } from '../../../src/utils/cx';
import type { HubEntryData } from './+data';
import surfaces from '../../../src/styles/surfaces.module.css';
import styles from './HubEntryPage.module.css';

function HubEntryPage() {
    const { entry, recommendations, recommendationCategory } = useData<HubEntryData>();

    return (
        <div className={styles.page}>
            <div className={cx(surfaces.container, surfaces.column)}>
                <HubBreadcrumb category={recommendationCategory} />
            </div>
            <div className={cx(surfaces.container, surfaces.column)}>
                <EntryDetail {...entry} />
            </div>
            <HubRecommendations entries={recommendations} category={recommendationCategory} />
        </div>
    );
}

export default ContainerWrap(HubEntryPage);

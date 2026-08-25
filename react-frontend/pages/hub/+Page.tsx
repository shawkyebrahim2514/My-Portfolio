import { useData } from 'vike-react/useData';
import ContainerWrap from '../../src/components/ContainerWrap';
import Title from '../../src/containers/Title';
import RichContent from '../../src/components/RichContent';
import HubViewsNav from '../../src/containers/Hub/ViewsNav';
import HubPostsListing from '../../src/containers/Hub/HubPostsListing';
import { filterVisible } from '../../src/containers/Hub/visibility';
import { useIsPreview } from '../../src/contexts/PreviewContext';
import { cx } from '../../src/utils/cx';
import type { HubIndexData } from './+data';
import section from '../../src/styles/section.module.css';
import surfaces from '../../src/styles/surfaces.module.css';
import lede from '../../src/styles/lede.module.css';

function Hub() {
    const { page, entries, categories } = useData<HubIndexData>();
    const isPreview = useIsPreview();
    const visibleEntries = filterVisible(entries, isPreview);

    return (
        <div className={section.section}>
            <Title title={page.title} />
            <div className={cx(surfaces.container, surfaces.column)}>
                <HubViewsNav activeView="entries" />
                <div className={lede.lede}>
                    <RichContent value={page.intro} />
                </div>
                <HubPostsListing entries={visibleEntries} categories={categories} />
            </div>
        </div>
    );
}

export default ContainerWrap(Hub);

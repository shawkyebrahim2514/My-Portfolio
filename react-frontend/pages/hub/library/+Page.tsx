import { useMemo } from 'react';
import { useData } from 'vike-react/useData';
import ContainerWrap from '../../../src/components/ContainerWrap';
import RichContent from '../../../src/components/RichContent';
import Title from '../../../src/containers/Title';
import HubViewsNav from '../../../src/containers/Hub/ViewsNav';
import LibraryListing from '../../../src/containers/Hub/LibraryListing';
import { filterVisible } from '../../../src/containers/Hub/visibility';
import { useIsPreview } from '../../../src/contexts/PreviewContext';
import { cx } from '../../../src/utils/cx';
import type { HubLibraryData } from './+data';
import section from '../../../src/styles/section.module.css';
import surfaces from '../../../src/styles/surfaces.module.css';
import lede from '../../../src/styles/lede.module.css';

function HubLibraryPage() {
    const { page, collections, saves } = useData<HubLibraryData>();
    const isPreview = useIsPreview();
    const visibleSaves = useMemo(() => filterVisible(saves, isPreview), [saves, isPreview]);

    return (
        <div className={section.section}>
            <Title title={page.title} />
            <div className={cx(surfaces.container, surfaces.column)}>
                <HubViewsNav activeView="library" />
                {page.intro.length > 0 && (
                    <div className={lede.lede}>
                        <RichContent value={page.intro} />
                    </div>
                )}
                <LibraryListing collections={collections} saves={visibleSaves} />
            </div>
        </div>
    );
}

export default ContainerWrap(HubLibraryPage);

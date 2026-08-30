import { useMemo } from 'react';
import { useData } from 'vike-react/useData';
import ContainerWrap from '../../../../src/components/ContainerWrap';
import Text from '../../../../src/components/Text';
import HubViewsNav from '../../../../src/containers/Hub/ViewsNav';
import LibraryListing from '../../../../src/containers/Hub/LibraryListing';
import { filterVisible } from '../../../../src/containers/Hub/visibility';
import { useIsPreview } from '../../../../src/contexts/PreviewContext';
import { cx } from '../../../../src/utils/cx';
import type { HubLibraryCollectionData } from './+data';
import section from '../../../../src/styles/section.module.css';
import surfaces from '../../../../src/styles/surfaces.module.css';
import lede from '../../../../src/styles/lede.module.css';

function HubLibraryCollectionPage() {
    const { collection, collections, saves } = useData<HubLibraryCollectionData>();
    const isPreview = useIsPreview();
    const visibleSaves = useMemo(() => filterVisible(saves, isPreview), [saves, isPreview]);

    return (
        <div className={section.section}>
            <Text variant="h1">{collection.title}</Text>
            <div className={cx(surfaces.container, surfaces.column)}>
                <HubViewsNav activeView="library" />
                {collection.description && (
                    <Text variant="body" className={lede.lede}>
                        {collection.description}
                    </Text>
                )}
                <LibraryListing
                    collections={collections}
                    saves={visibleSaves}
                    activeSlug={collection.slug}
                />
            </div>
        </div>
    );
}

export default ContainerWrap(HubLibraryCollectionPage);

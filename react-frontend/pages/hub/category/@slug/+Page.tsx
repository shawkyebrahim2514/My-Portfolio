import { useData } from 'vike-react/useData';
import ContainerWrap from '../../../../src/components/ContainerWrap';
import Text from '../../../../src/components/Text';
import CategoryFilters from '../../../../src/containers/Hub/CategoryFilters';
import Grid from '../../../../src/containers/Hub/Grid';
import { cx } from '../../../../src/utils/cx';
import type { HubCategoryData } from './+data';
import section from '../../../../src/styles/section.module.css';
import surfaces from '../../../../src/styles/surfaces.module.css';
import lede from '../../../../src/styles/lede.module.css';

function HubCategoryPage() {
    const { category, entries, categories } = useData<HubCategoryData>();

    return (
        <div className={section.section}>
            <Text variant="h1">{category.title}</Text>
            <div className={cx(surfaces.container, surfaces.column)}>
                {category.description && (
                    <Text variant="body" className={lede.lede}>{category.description}</Text>
                )}
                <CategoryFilters categories={categories} activeSlug={category.slug} />
                <Grid entries={entries} />
            </div>
        </div>
    );
}

export default ContainerWrap(HubCategoryPage);

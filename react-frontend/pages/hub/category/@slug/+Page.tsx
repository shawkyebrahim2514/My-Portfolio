import { useData } from 'vike-react/useData';
import ContainerWrap from '../../../../src/components/ContainerWrap';
import Text from '../../../../src/components/Text';
import CategoryFilters from '../../../../src/containers/Hub/CategoryFilters';
import Grid from '../../../../src/containers/Hub/Grid';
import type { HubCategoryData } from './+data';
import styles from '../../../../src/styles/section.module.css';

function HubCategoryPage() {
    const { category, entries, categories } = useData<HubCategoryData>();

    return (
        <div className={styles.section}>
            <Text variant="h1">{category.title}</Text>
            {category.description && <Text>{category.description}</Text>}
            <CategoryFilters categories={categories} activeSlug={category.slug} />
            <Grid entries={entries} />
        </div>
    );
}

export default ContainerWrap(HubCategoryPage);

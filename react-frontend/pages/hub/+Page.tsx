import { useData } from 'vike-react/useData';
import ContainerWrap from '../../src/components/ContainerWrap';
import Title from '../../src/containers/Title';
import RichContent from '../../src/components/RichContent';
import CategoryFilters from '../../src/containers/Hub/CategoryFilters';
import Grid from '../../src/containers/Hub/Grid';
import { cx } from '../../src/utils/cx';
import type { HubIndexData } from './+data';
import section from '../../src/styles/section.module.css';
import surfaces from '../../src/styles/surfaces.module.css';
import lede from '../../src/styles/lede.module.css';

function Hub() {
    const { page, entries, categories } = useData<HubIndexData>();

    return (
        <div className={section.section}>
            <Title title={page.title} />
            <div className={cx(surfaces.container, surfaces.column)}>
                <div className={lede.lede}>
                    <RichContent value={page.intro} />
                </div>
                <CategoryFilters categories={categories} />
                <Grid entries={entries} />
            </div>
        </div>
    );
}

export default ContainerWrap(Hub);

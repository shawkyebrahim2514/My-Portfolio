import { useData } from 'vike-react/useData';
import ContainerWrap from '../../src/components/ContainerWrap';
import Content from '../../src/containers/Skills/Content';
import Title from '../../src/containers/Title';
import type { SanitySkillsPage } from '../../src/Types';
import styles from '../../src/styles/section.module.css';

function Skills() {
    const skillsPage = useData<SanitySkillsPage>();

    return (
        <div className={styles.section}>
            <Title title={skillsPage.title} />
            <Content categories={skillsPage.categories} />
        </div>
    );
}

export default ContainerWrap(Skills);

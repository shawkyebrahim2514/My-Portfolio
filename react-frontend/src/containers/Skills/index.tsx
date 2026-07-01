import ContainerWrap from '../../components/ContainerWrap'
import Content from './Content';
import { SanitySkillsPage } from '../../Types';
import { getSkillsPage } from '../../APIs';
import Title from '../Title';
import Loader from '../../components/Loader';
import SectionError from '../../components/SectionError';
import { useSanityQuery } from '../../hooks/useSanityQuery';
import styles from '../../styles/section.module.css';

function Skills() {
    const { data: skillsPage, error } = useSanityQuery<SanitySkillsPage>(getSkillsPage);

    if (error) return <SectionError />;
    if (!skillsPage) return <Loader />;

    return (
        <div className={styles.section}>
            <Title title={skillsPage.title} />
            <Content categories={skillsPage.categories} />
        </div>
    )
}

export default ContainerWrap(Skills)
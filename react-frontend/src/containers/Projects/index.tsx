import ContainerWrap from '../../components/ContainerWrap'
import { SanityProjectsPage } from '../../Types';
import { getProjectsPage } from '../../APIs';
import Loader from '../../components/Loader';
import SectionError from '../../components/SectionError';
import Title from '../Title';
import Content from './Content';
import { useSanityQuery } from '../../hooks/useSanityQuery';
import styles from '../../styles/section.module.css';

function Projects() {
    const { data: projects, error } = useSanityQuery<SanityProjectsPage>(getProjectsPage);

    if (error) return <SectionError />;
    if (!projects) return <Loader />;

    return (
        <div className={styles.section}>
            <Title title={projects.title} />
            <Content projects={projects.projects} />
        </div>
    )
}

export default ContainerWrap(Projects)

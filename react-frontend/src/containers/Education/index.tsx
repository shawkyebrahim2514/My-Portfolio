import ContainerWrap from '../../components/ContainerWrap'
import { SanityEducationPage } from '../../Types';
import { getEducationPage } from '../../APIs';
import Loader from '../../components/Loader';
import SectionError from '../../components/SectionError';
import Title from '../Title';
import Content from './Content';
import { useSanityQuery } from '../../hooks/useSanityQuery';
import styles from '../../styles/section.module.css';

function Education() {
    const { data: educationPage, error } = useSanityQuery<SanityEducationPage>(getEducationPage);

    if (error) return <SectionError />;
    if (!educationPage) return <Loader />;

    return (
        <div className={styles.section}>
            <Title title={educationPage.title} />
            <Content education={educationPage.education} />
        </div>
    )
}

export default ContainerWrap(Education)

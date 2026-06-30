import ContainerWrap from '../../components/ContainerWrap'
import { SanityExperiencePage } from '../../Types';
import Certificates from './Certificates';
import { getExperiencePage } from '../../APIs';
import Loader from '../../components/Loader';
import SectionError from '../../components/SectionError';
import Internships from './Internships';
import ProfessionalExperience from './ProfessionalExperience';
import { useSanityQuery } from '../../hooks/useSanityQuery';
import styles from '../../styles/section.module.css';

function Experience() {
    const { data: experiences, error } = useSanityQuery<SanityExperiencePage>(getExperiencePage);

    if (error) return <SectionError />;
    if (!experiences) return <Loader />;

    return (
        <div className={styles.section}>
            <ProfessionalExperience professionalExperienceSection={experiences.professionalExperienceSection} />
            <Internships internshipsSection={experiences.internshipsSection} />
            <Certificates certificatesSection={experiences.certificatesSection} />
        </div>
    )
}

export default ContainerWrap(Experience)

import { useData } from 'vike-react/useData';
import ContainerWrap from '../../src/components/ContainerWrap';
import Certificates from '../../src/containers/Experience/Certificates';
import Internships from '../../src/containers/Experience/Internships';
import ProfessionalExperience from '../../src/containers/Experience/ProfessionalExperience';
import type { SanityExperiencePage } from '../../src/Types';
import styles from '../../src/styles/section.module.css';

function Experience() {
  const experiences = useData<SanityExperiencePage>();

  return (
    <div className={styles.section}>
      <ProfessionalExperience professionalExperienceSection={experiences.professionalExperienceSection} />
      <Internships internshipsSection={experiences.internshipsSection} />
      <Certificates certificatesSection={experiences.certificatesSection} />
    </div>
  );
}

export default ContainerWrap(Experience);

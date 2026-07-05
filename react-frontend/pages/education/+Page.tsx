import { useData } from 'vike-react/useData';
import ContainerWrap from '../../src/components/ContainerWrap';
import Title from '../../src/containers/Title';
import Content from '../../src/containers/Education/Content';
import type { SanityEducationPage } from '../../src/Types';
import styles from '../../src/styles/section.module.css';

function Education() {
  const educationPage = useData<SanityEducationPage>();

  return (
    <div className={styles.section}>
      <Title title={educationPage.title} />
      <Content education={educationPage.education} />
    </div>
  );
}

export default ContainerWrap(Education);

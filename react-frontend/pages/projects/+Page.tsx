import { useData } from 'vike-react/useData';
import ContainerWrap from '../../src/components/ContainerWrap';
import Title from '../../src/containers/Title';
import Content from '../../src/containers/Projects/Content';
import type { SanityProjectsPage } from '../../src/Types';
import styles from '../../src/styles/section.module.css';

function Projects() {
  const projects = useData<SanityProjectsPage>();

  return (
    <div className={styles.section}>
      <Title title={projects.title} />
      <Content projects={projects.projects} />
    </div>
  );
}

export default ContainerWrap(Projects);

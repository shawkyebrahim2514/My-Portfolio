// Vike page for / (About). Mirrors the old src/containers/About/index.tsx
// but fetches via +data.ts (build-time) instead of client-side useSanityQuery.
import { useData } from 'vike-react/useData';
import ContainerWrap from '../../src/components/ContainerWrap';
import Content from '../../src/containers/About/Content';
import Image from '../../src/containers/About/Image';
import HubTeaser from '../../src/containers/About/HubTeaser';
import type { SanityAboutPage } from '../../src/Types';
import styles from '../../src/containers/About/About.module.css';

function About() {
  const aboutPage = useData<SanityAboutPage>();

  return (
    <>
      <div className={styles.container}>
        <Content description={aboutPage.description} />
        <Image personImage={aboutPage.personImage} circularRingText={aboutPage.circularRingText} />
      </div>
      <HubTeaser entries={aboutPage.featuredHubEntries ?? []} />
    </>
  );
}

export default ContainerWrap(About);

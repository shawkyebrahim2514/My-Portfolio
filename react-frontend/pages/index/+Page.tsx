import { useData } from 'vike-react/useData';
import ContainerWrap from '../../src/components/ContainerWrap';
import Content from '../../src/containers/About/Content';
import Image from '../../src/containers/About/Image';
import HubTeaser from '../../src/containers/About/HubTeaser';
import FollowsTeaser from '../../src/containers/About/FollowsTeaser';
import type { SanityAboutPage } from '../../src/Types';
import styles from '../../src/containers/About/About.module.css';

function About() {
    const aboutPage = useData<SanityAboutPage>();
    const firstBody = aboutPage.description.findIndex(
        (node) => node._type !== 'block' || !node.style?.match(/^h[1-6]$/)
    );
    const introEnd = firstBody < 0 ? aboutPage.description.length : firstBody;

    return (
        <>
            <div className={styles.container}>
                <Content
                    description={aboutPage.description.slice(0, introEnd)}
                    resume={aboutPage.resume}
                    showActions
                />
                <Image
                    personImage={aboutPage.personImage}
                    circularRingText={aboutPage.circularRingText}
                />
            </div>
            <Content description={aboutPage.description.slice(introEnd)} />
            <FollowsTeaser follows={aboutPage.featuredFollows ?? []} />
            <HubTeaser entries={aboutPage.featuredHubEntries ?? []} />
        </>
    );
}

export default ContainerWrap(About);

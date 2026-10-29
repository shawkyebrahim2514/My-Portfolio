import { useData } from 'vike-react/useData';
import type { ReactNode } from 'react';
import ContainerWrap from '../../src/components/ContainerWrap';
import Content from '../../src/containers/About/Content';
import Image from '../../src/containers/About/Image';
import HubTeaser from '../../src/containers/About/HubTeaser';
import FollowsTeaser from '../../src/containers/About/FollowsTeaser';
import type { SanityAboutPage } from '../../src/Types';
import styles from '../../src/containers/About/About.module.css';

export function About({ portrait }: { portrait?: ReactNode }) {
    const aboutPage = useData<SanityAboutPage>();
    const firstBody = aboutPage.description.findIndex(
        (node) => node._type !== 'block' || !node.style?.match(/^h[1-6]$/)
    );
    const introEnd = firstBody < 0 ? aboutPage.description.length : firstBody;

    return (
        <>
            <section className={styles.container} aria-label="Introduction">
                <div className={styles.portrait}>
                    {portrait ?? (
                        <Image
                            personImage={aboutPage.personImage}
                            circularRingText={aboutPage.circularRingText}
                        />
                    )}
                </div>
                <div className={styles.introduction}>
                    <Content
                        description={aboutPage.description.slice(0, introEnd)}
                        resume={aboutPage.resume}
                        showActions
                    />
                </div>
            </section>
            <Content description={aboutPage.description.slice(introEnd)} />
            <FollowsTeaser follows={aboutPage.featuredFollows ?? []} />
            <HubTeaser entries={aboutPage.featuredHubEntries ?? []} />
        </>
    );
}

export default ContainerWrap(About);

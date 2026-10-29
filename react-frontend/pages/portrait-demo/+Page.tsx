import ContainerWrap from '../../src/components/ContainerWrap';
import { useId, useState } from 'react';
import { useData } from 'vike-react/useData';
import type { SanityAboutPage } from '../../src/Types';
import { sanityImageProps } from '../../src/utils/sanityImage';
import Image from '../../src/containers/About/Image';
import { About } from '../index/+Page';
import styles from './PortraitDemo.module.css';

const concepts = [
    {
        id: 'signature',
        name: 'Signature corner',
        description: 'Cream photo mount, one generous corner and a peach offset edge.',
        palette: 'Cream / charcoal / peach',
    },
    {
        id: 'editorial',
        name: 'Editorial print',
        description: 'An upright photo on an ivory print, with a tilted sage backing.',
        palette: 'Ivory / espresso / sage',
    },
    {
        id: 'geometric',
        name: 'Soft geometric badge',
        description: 'A rounded hexagon that echoes the site background, edged in butter yellow.',
        palette: 'Warm white / charcoal / butter',
    },
] as const;

type Concept = (typeof concepts)[number]['id'];

function ConceptPortrait({ concept, featured = false }: { concept: Concept; featured?: boolean }) {
    const { personImage } = useData<SanityAboutPage>();
    const clipId = useId();
    const clip = concept === 'geometric' ? `url("#${clipId}")` : undefined;

    if (concept === 'signature') {
        return <Image personImage={personImage} priority={featured} />;
    }

    return (
        <figure className={`${styles.portrait} ${styles[concept]}`} data-portrait-concept={concept}>
            {concept === 'geometric' && (
                <svg className={styles.clipDefinition} aria-hidden="true" focusable="false">
                    <defs>
                        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                            <path d="M .29 .02 H .71 Q .75 .02 .77 .06 L .97 .46 Q .99 .5 .97 .54 L .77 .94 Q .75 .98 .71 .98 H .29 Q .25 .98 .23 .94 L .03 .54 Q .01 .5 .03 .46 L .23 .06 Q .25 .02 .29 .02 Z" />
                        </clipPath>
                    </defs>
                </svg>
            )}
            <div className={styles.crop} style={{ clipPath: clip }}>
                <img
                    {...sanityImageProps(
                        personImage,
                        featured ? 640 : 320,
                        '(max-width: 900px) 168px, 264px'
                    )}
                    alt="Shawky Ebrahim"
                    width={316}
                    height={316}
                    className={styles.photo}
                    style={{ clipPath: clip }}
                    fetchPriority={featured ? 'high' : undefined}
                    loading={featured ? 'eager' : 'lazy'}
                    decoding="async"
                />
            </div>
            {concept === 'editorial' && (
                <figcaption className={styles.printCaption}>
                    <span>Shawky Ebrahim</span>
                    <span>Software Engineer</span>
                </figcaption>
            )}
        </figure>
    );
}

function PortraitDemo() {
    const [selected, setSelected] = useState<Concept>('signature');

    return (
        <>
            <aside className={styles.notice} aria-label="Design preview">
                <span>Local portrait studio - same photo, three directions</span>
                <a href="/">View the selected homepage</a>
            </aside>
            <nav className={styles.controls} aria-label="Portrait treatments">
                {concepts.map((concept) => (
                    <button
                        key={concept.id}
                        type="button"
                        data-concept={concept.id}
                        aria-pressed={selected === concept.id}
                        onClick={() => setSelected(concept.id)}
                    >
                        {concept.name}
                    </button>
                ))}
                <a href="#portrait-gallery">See all three together</a>
            </nav>
            <About
                portrait={<ConceptPortrait concept={selected} featured />}
                afterIntroduction={
                    <section
                        id="portrait-gallery"
                        className={styles.gallery}
                        aria-labelledby="portrait-gallery-title"
                    >
                        <h2 id="portrait-gallery-title">Three ways to frame the same story</h2>
                        <p>
                            All three use your existing CMS photo. Choose a treatment above to see
                            it in the hero. The homepage now uses Signature corner; the other frames
                            remain here for comparison.
                        </p>
                        <div className={styles.cards}>
                            {concepts.map((concept, index) => (
                                <article className={styles.card} key={concept.id}>
                                    <div className={styles.cardHeading}>
                                        <span>0{index + 1}</span>
                                        <h3>{concept.name}</h3>
                                    </div>
                                    <div className={styles.sample}>
                                        <ConceptPortrait concept={concept.id} />
                                    </div>
                                    <p className={styles.palette}>{concept.palette}</p>
                                    <p>{concept.description}</p>
                                    <button
                                        type="button"
                                        aria-pressed={selected === concept.id}
                                        onClick={() => {
                                            setSelected(concept.id);
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        Preview {concept.name}
                                    </button>
                                </article>
                            ))}
                        </div>
                    </section>
                }
            />
        </>
    );
}

export default ContainerWrap(PortraitDemo);

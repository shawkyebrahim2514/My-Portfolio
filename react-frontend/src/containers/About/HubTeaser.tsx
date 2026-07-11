import { memo } from 'react';
import MagazineBentoTeaser from './variants/MagazineBentoTeaser';
import RailTeaser from './variants/RailTeaser';
import PinboardTeaser from './variants/PinboardTeaser';
import BentoSpotlightTeaser from './variants/BentoSpotlightTeaser';
import type { SanityHubEntrySummary } from '../../Types';
import styles from './HubTeaser.module.css';

type HubTeaserProps = {
    readonly entries: (SanityHubEntrySummary | null)[];
};

// SHOWCASE build: renders the "Things Worth Sharing" section three times, once
// per candidate design, each behind a labeled banner — so the three directions
// can be compared on one page without switching branches. Pick a winner, then
// this wrapper is replaced by the single chosen variant.
const VARIANTS: readonly {
    id: string;
    label: string;
    blurb: string;
    Component: typeof RailTeaser;
}[] = [
    {
        id: '01',
        label: 'Design 01 · Magazine Bento',
        blurb: 'Asymmetric bento on a dark editorial canvas: one large featured pick + satellite cards, index numerals, accent rails.',
        Component: MagazineBentoTeaser,
    },
    {
        id: '02',
        label: 'Design 02 · Horizontal Rail + Marquee',
        blurb: 'Scrolling ticker headline over a flick-through, scroll-snapping rail of cards.',
        Component: RailTeaser,
    },
    {
        id: '06',
        label: 'Design 06 · Collage / Pinboard',
        blurb: 'Cards pinned to a masonry board with tape + tack; hover straightens and lifts.',
        Component: PinboardTeaser,
    },
    {
        id: '07',
        label: 'Design 07 · Magazine Bento + Accent Spotlight',
        blurb: 'Bento grid with a hero cell; hovering a card washes the section in its accent.',
        Component: BentoSpotlightTeaser,
    },
];

function HubTeaser({ entries }: HubTeaserProps) {
    return (
        <div className={styles.showcase}>
            {VARIANTS.map(({ id, label, blurb, Component }) => (
                <section className={styles.slot} key={id} aria-label={label}>
                    <div className={styles.banner}>
                        <span className={styles.badge}>{id}</span>
                        <div className={styles.bannerText}>
                            <span className={styles.label}>{label}</span>
                            <span className={styles.blurb}>{blurb}</span>
                        </div>
                    </div>
                    <Component entries={entries} />
                </section>
            ))}
        </div>
    );
}

export default memo(HubTeaser);

import { memo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faUpRightFromSquare, faHeadphones, faMusic } from '@fortawesome/free-solid-svg-icons';
import { faSpotify, faYoutube, faApple, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Text from '../Text';
import { cx } from '../../utils/cx';
import { resolveEpisodeEmbed, type EpisodeProvider } from '../../utils/embeds';
import type { RichPodcastEpisode } from '../../Types';
import styles from './PodcastEpisode.module.css';

// Brand glyph shown on each episode card, keyed off the provider derived from
// the episode URL. Apple/SoundCloud/Anghami link out but still get their icon;
// unknown links fall back to a generic headphones glyph.
const PROVIDER_ICON: Record<EpisodeProvider, IconDefinition> = {
    spotify: faSpotify,
    youtube: faYoutube,
    apple: faApple,
    soundcloud: faSoundcloud,
    anghami: faMusic,
    other: faHeadphones,
};

// A single podcast episode card embedded in a Podcast entry's body. Spotify
// and YouTube links play inline via a click-to-load facade (both embeds are
// key-free and self-contained); any other link falls back to a "Listen"
// button that opens the episode in a new tab. `featured` renders a larger
// pinned variant used for the episode at the top of the page.
function PodcastEpisode({ value }: { value: RichPodcastEpisode }) {
    const [playing, setPlaying] = useState(false);
    const { provider, embedUrl } = resolveEpisodeEmbed(value.url);

    const meta = [value.date, value.duration].filter(Boolean).join(' · ');
    const providerIcon = PROVIDER_ICON[provider];
    const canPlay = Boolean(embedUrl);
    const isVideo = provider === 'youtube';

    return (
        <figure className={cx(styles.card, value.featured && styles.featured, playing && styles.playing)} dir="auto">
            {playing && embedUrl ? (
                <div className={cx(styles.playerWrap, isVideo ? styles.video : styles.audio)}>
                    <iframe
                        className={styles.frame}
                        src={embedUrl}
                        title={value.title}
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            ) : (
                <div className={styles.head}>
                    {value.episodeLabel && (
                        <span className={styles.badge} aria-hidden="true">
                            {value.episodeLabel}
                        </span>
                    )}
                    <div className={styles.info}>
                        {value.featured && <span className={styles.eyebrow}>Featured episode</span>}
                        <Text variant={value.featured ? 'h3' : 'h4'} className={styles.title}>
                            {value.title}
                        </Text>
                        {meta && <p className={styles.meta}>{meta}</p>}
                        {value.note && <p className={styles.note}>{value.note}</p>}

                        {canPlay ? (
                            <button
                                type="button"
                                className={styles.play}
                                onClick={() => setPlaying(true)}
                                aria-label={`Play episode: ${value.title}`}
                            >
                                <FontAwesomeIcon icon={faPlay} aria-hidden="true" />
                                <span>Play episode</span>
                            </button>
                        ) : (
                            <a
                                className={styles.play}
                                href={value.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FontAwesomeIcon icon={faUpRightFromSquare} aria-hidden="true" />
                                <span>Listen</span>
                            </a>
                        )}

                        <span className={styles.provider} aria-hidden="true">
                            <FontAwesomeIcon icon={providerIcon} />
                        </span>
                    </div>
                </div>
            )}
        </figure>
    );
}

export default memo(PodcastEpisode);

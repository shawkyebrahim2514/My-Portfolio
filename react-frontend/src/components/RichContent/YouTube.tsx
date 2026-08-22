import { memo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Text from '../Text';
import { cx } from '../../utils/cx';
import { extractYouTubeId } from '../../utils/youtube';
import type { RichYouTube } from '../../Types';
import styles from './YouTube.module.css';

// Rich horizontal video card embedded in body content: thumbnail (left) +
// title / caption / channel (right). Click-to-play facade — no YouTube iframe
// loads until the viewer clicks, then it autoplays (youtube-nocookie) and the
// card expands to full width. Title/channel/thumbnail are filled at build
// time via oEmbed (see utils/youtube.ts); this degrades gracefully to
// thumbnail + play + caption if that enrichment is missing.
function YouTube({ value, variant = 'row' }: { value: RichYouTube; variant?: 'row' | 'stack' }) {
    const [playing, setPlaying] = useState(false);
    const videoId = value.videoId ?? extractYouTubeId(value.url);
    if (!videoId) return null;

    const thumb = value.thumbnail ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const title = value.videoTitle ?? value.caption ?? 'YouTube video';

    return (
        <figure className={cx(styles.card, playing && styles.playing, variant === 'stack' && styles.stack)}>
            <div className={styles.posterWrap}>
                {playing ? (
                    <iframe
                        className={styles.frame}
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                ) : (
                    <button
                        type="button"
                        className={styles.poster}
                        onClick={() => setPlaying(true)}
                        aria-label={`Play video: ${title}`}
                    >
                        <img className={styles.thumb} src={thumb} alt="" loading="lazy" />
                        <span className={styles.play} aria-hidden="true">
                            <FontAwesomeIcon icon={faPlay} />
                        </span>
                    </button>
                )}
            </div>

            <figcaption className={styles.body} dir="auto">
                <Text variant="h4" className={styles.title}>
                    {title}
                </Text>
                {value.caption && value.caption !== title && (
                    <p className={styles.desc}>
                        {value.caption}
                    </p>
                )}
                {value.channelTitle && (
                    <div className={styles.footer}>
                        {value.channelUrl ? (
                            <a
                                className={styles.channel}
                                href={value.channelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {value.channelTitle}
                            </a>
                        ) : (
                            <span className={styles.channel}>
                                {value.channelTitle}
                            </span>
                        )}
                    </div>
                )}
            </figcaption>
        </figure>
    );
}

export default memo(YouTube);

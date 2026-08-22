import { memo } from 'react';
import { PortableText } from '@portabletext/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faStar } from '@fortawesome/free-solid-svg-icons';
import YouTube from './YouTube';
import { components } from './components';
import type { RichCuratedVideo, RichYouTube } from '../../Types';
import styles from './CuratedVideo.module.css';

function CuratedVideo({ value }: { value: RichCuratedVideo }) {
    const video: RichYouTube = {
        ...value,
        _type: 'youtube',
    };
    const hasCompanionContent = Boolean(value.companionContent?.length);

    return (
        <section
            className={styles.section}
            aria-label={value.videoTitle ? `Curated video: ${value.videoTitle}` : 'Curated video'}
        >
            {value.featured && (
                <span className={styles.featured}>
                    <FontAwesomeIcon icon={faStar} />
                    Featured video
                </span>
            )}

            <YouTube value={video} />

            {hasCompanionContent && (
                <div className={styles.companion}>
                    <div className={styles.companionLabel}>
                        <FontAwesomeIcon icon={faBookOpen} />
                        Notes and context
                    </div>
                    <PortableText value={value.companionContent!} components={components} />
                </div>
            )}
        </section>
    );
}

export default memo(CuratedVideo);

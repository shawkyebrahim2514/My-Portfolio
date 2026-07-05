import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faNewspaper,
    faPlay,
    faPodcast,
    faBookOpen,
    faBook,
    faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import Text from '../../components/Text';
import ListButtons from '../../components/ListButtons';
import RichContent from '../../components/RichContent';
import StarBorder from '../../components/StarBorder';
import buttonStyles from '../../components/Button/Button.module.css';
import { cx } from '../../utils/cx';
import type { SanityHubEntry, HubEntryKind, HubEntryCategoryRef } from '../../Types';
import styles from './EntryDetail.module.css';

const KIND_META: Record<HubEntryKind, { icon: typeof faNewspaper; label: string }> = {
    article: { icon: faNewspaper, label: 'Article' },
    video: { icon: faPlay, label: 'Video' },
    podcast: { icon: faPodcast, label: 'Podcast' },
    read: { icon: faBookOpen, label: 'Read' },
    book: { icon: faBook, label: 'Book' },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function EntryDetail(entry: SanityHubEntry) {
    const { title, kind, excerpt, coverImage, sourceThumbnail, sourceName, externalUrl, durationLabel, publishedAt, tags, body, categories } = entry;
    const { icon, label } = KIND_META[kind];
    const image = coverImage ?? sourceThumbnail;
    const resolvedCategories = categories.filter((category): category is HubEntryCategoryRef => Boolean(category));

    return (
        <article className={styles.article}>
            <div className={styles.meta}>
                <span className={styles.badge}>
                    <FontAwesomeIcon icon={icon} />
                    {label}
                </span>
                <Text className={styles.date}>{formatDate(publishedAt)}</Text>
                {durationLabel && <Text className={styles.date}>{durationLabel}</Text>}
            </div>

            <Text variant="h1">{title}</Text>
            <Text className={styles.excerpt}>{excerpt}</Text>

            {resolvedCategories.length > 0 && (
                <ListButtons elements={resolvedCategories.map((category) => category.title)} />
            )}

            {image && (
                <div className={styles.imageFrame}>
                    <img className={styles.image} src={image} alt="" />
                </div>
            )}

            {externalUrl && (
                <StarBorder>
                    <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cx(buttonStyles.button, buttonStyles.lg, buttonStyles.pointer, styles.externalLink)}
                    >
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        {sourceName ? `View on ${sourceName}` : 'View original source'}
                    </a>
                </StarBorder>
            )}

            {body && body.length > 0 && <RichContent value={body} />}

            {tags && tags.length > 0 && <ListButtons elements={tags} />}
        </article>
    );
}

export default memo(EntryDetail);

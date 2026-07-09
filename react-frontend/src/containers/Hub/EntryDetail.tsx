import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faNewspaper,
    faPodcast,
    faBookOpen,
    faBook,
    faArrowUpRightFromSquare,
    faStar,
    faTv,
} from '@fortawesome/free-solid-svg-icons';
import Text from '../../components/Text';
import ListButtons from '../../components/ListButtons';
import RichContent from '../../components/RichContent';
import StarBorder from '../../components/StarBorder';
import buttonStyles from '../../components/Button/Button.module.css';
import { cx } from '../../utils/cx';
import type { SanityHubEntry, HubEntryKind, HubEntryCategoryRef, HubContentLanguage } from '../../Types';
import styles from './EntryDetail.module.css';

const KIND_META: Record<HubEntryKind, { icon: typeof faNewspaper; label: string }> = {
    article: { icon: faNewspaper, label: 'Article' },
    channel: { icon: faTv, label: 'Channel' },
    podcast: { icon: faPodcast, label: 'Podcast' },
    read: { icon: faBookOpen, label: 'Read' },
    book: { icon: faBook, label: 'Book' },
};

function formatDate(iso: string, language: HubContentLanguage) {
    const locale = language === 'ar' ? 'ar' : undefined;
    return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

function EntryDetail(entry: SanityHubEntry) {
    const {
        title,
        kind,
        excerpt,
        coverImage,
        sourceThumbnail,
        sourceName,
        channelHandle,
        externalUrl,
        durationLabel,
        publishedAt,
        tags,
        body,
        categories,
        featuredInCategory,
        language = 'en',
    } = entry;
    const { icon, label } = KIND_META[kind] ?? KIND_META.article;
    const image = coverImage ?? sourceThumbnail;
    const isRTL = language === 'ar';
    const isChannel = kind === 'channel';
    const hasBody = Boolean(body && body.length > 0);
    const resolvedCategories = categories.filter((category): category is HubEntryCategoryRef => Boolean(category));

    return (
        <article className={cx(styles.article, isRTL && styles.rtl)} dir={isRTL ? 'rtl' : undefined} lang={language}>
            <div className={styles.meta}>
                <span className={styles.badge}>
                    <FontAwesomeIcon icon={icon} />
                    {label}
                </span>
                {featuredInCategory && (
                    <span className={cx(styles.badge, styles.pick)}>
                        <FontAwesomeIcon icon={faStar} />
                        Editor&apos;s pick
                    </span>
                )}
                <Text className={styles.date}>{formatDate(publishedAt, language)}</Text>
                {durationLabel && <Text className={styles.date}>{durationLabel}</Text>}
            </div>

            {isChannel ? (
                <div className={styles.channelHero}>
                    {image && (
                        <img className={styles.channelAvatar} src={image} alt="" />
                    )}
                    <div className={styles.channelInfo}>
                        <Text variant="h1" className={styles.channelName}>
                            {title}
                        </Text>
                        {(channelHandle || sourceName) && (
                            <Text className={styles.channelMeta}>
                                {[channelHandle, sourceName].filter(Boolean).join(' · ')}
                            </Text>
                        )}
                        <Text className={styles.channelTagline}>{excerpt}</Text>
                        {externalUrl && (
                            <a
                                href={externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cx(buttonStyles.button, buttonStyles.md, buttonStyles.pointer, styles.channelCta)}
                            >
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                {sourceName ? `Visit on ${sourceName}` : 'Visit channel'}
                            </a>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <Text variant="h1">{title}</Text>
                    <Text className={styles.excerpt}>{excerpt}</Text>
                </>
            )}

            {resolvedCategories.length > 0 && (
                <ListButtons elements={resolvedCategories.map((category) => category.title)} />
            )}

            {!isChannel && image && (
                <div className={styles.imageFrame}>
                    <img className={styles.image} src={image} alt="" />
                </div>
            )}

            {!isChannel && externalUrl && (
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

            {isChannel && hasBody && (
                <Text variant="h3" className={styles.channelBodyHeading}>
                    Videos worth watching
                </Text>
            )}

            {hasBody && <RichContent value={body} />}

            {tags && tags.length > 0 && <ListButtons elements={tags} />}
        </article>
    );
}

export default memo(EntryDetail);

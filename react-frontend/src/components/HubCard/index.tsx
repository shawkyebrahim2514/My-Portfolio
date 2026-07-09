import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faPodcast, faBookOpen, faTv } from '@fortawesome/free-solid-svg-icons';
import { cx } from '../../utils/cx';
import Text from '../Text';
import ListButtons from '../ListButtons';
import { accentStyle } from '../../containers/Hub/kindAccent';
import surfaces from '../../styles/surfaces.module.css';
import type { HubEntryKind, HubEntryCategoryRef, HubContentLanguage } from '../../Types';
import styles from './HubCard.module.css';

const KIND_META: Record<HubEntryKind, { icon: typeof faNewspaper; label: string }> = {
    article: { icon: faNewspaper, label: 'Article' },
    channel: { icon: faTv, label: 'Channel' },
    podcast: { icon: faPodcast, label: 'Podcast' },
    read: { icon: faBookOpen, label: 'Reading List' },
};

export type HubCardProps = {
    readonly title: string;
    readonly slug: string;
    readonly kind: HubEntryKind;
    readonly excerpt: string;
    readonly coverImage?: string;
    readonly sourceThumbnail?: string;
    readonly durationLabel?: string;
    readonly categories: (HubEntryCategoryRef | null)[];
    readonly language?: HubContentLanguage;
};

function HubCard({ title, slug, kind, excerpt, coverImage, sourceThumbnail, durationLabel, categories, language = 'en' }: HubCardProps) {
    const { icon, label } = KIND_META[kind] ?? KIND_META.article;
    const image = coverImage ?? sourceThumbnail;
    const isRTL = language === 'ar';
    const resolvedCategories = categories.filter((category): category is HubEntryCategoryRef => Boolean(category));

    return (
        <a href={`/hub/${slug}`} className={cx(surfaces.container, styles.card)} style={accentStyle(kind)}>
            {image && (
                <div className={styles.imageFrame}>
                    <img className={styles.image} src={image} alt="" loading="lazy" />
                    <span className={styles.badge}>
                        <FontAwesomeIcon icon={icon} />
                        {label}
                    </span>
                </div>
            )}
            <div className={cx(styles.content, isRTL && styles.rtl)} dir={isRTL ? 'rtl' : undefined} lang={language}>
                {!image && (
                    <span className={styles.badge}>
                        <FontAwesomeIcon icon={icon} />
                        {label}
                    </span>
                )}
                <Text variant="h4">{title}</Text>
                <Text className={styles.excerpt}>{excerpt}</Text>
                {resolvedCategories.length > 0 && (
                    <ListButtons elements={resolvedCategories.map((category) => category.title)} />
                )}
                {durationLabel && <Text className={styles.duration}>{durationLabel}</Text>}
            </div>
        </a>
    );
}

export default memo(HubCard);

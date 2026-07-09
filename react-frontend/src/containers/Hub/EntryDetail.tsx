import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faNewspaper,
    faPodcast,
    faBookOpen,
    faArrowUpRightFromSquare,
    faStar,
    faTv,
    faRss,
    faMusic,
    faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { faSpotify, faApple, faYoutube, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Text from '../../components/Text';
import ListButtons from '../../components/ListButtons';
import RichContent from '../../components/RichContent';
import StarBorder from '../../components/StarBorder';
import PodcastEpisode from '../../components/RichContent/PodcastEpisode';
import YouTube from '../../components/RichContent/YouTube';
import ReadingItem from '../../components/RichContent/ReadingItem';
import ArticleToc, { type TocHeading } from '../../components/ArticleToc';
import buttonStyles from '../../components/Button/Button.module.css';
import { accentStyle } from './kindAccent';
import { cx } from '../../utils/cx';
import type {
    SanityHubEntry,
    HubEntryKind,
    HubEntryCategoryRef,
    HubContentLanguage,
    HubPlatformLink,
    RichContentNode,
    RichPodcastEpisode,
    RichYouTube,
    RichReadingItem,
} from '../../Types';
import styles from './EntryDetail.module.css';

const KIND_META: Record<HubEntryKind, { icon: typeof faNewspaper; label: string }> = {
    article: { icon: faNewspaper, label: 'Article' },
    channel: { icon: faTv, label: 'Channel' },
    podcast: { icon: faPodcast, label: 'Podcast' },
    read: { icon: faBookOpen, label: 'Reading List' },
};

const PLATFORM_META: Record<HubPlatformLink['platform'], { icon: IconDefinition; label: string }> = {
    spotify: { icon: faSpotify, label: 'Spotify' },
    apple: { icon: faApple, label: 'Apple Podcasts' },
    youtube: { icon: faYoutube, label: 'YouTube' },
    soundcloud: { icon: faSoundcloud, label: 'SoundCloud' },
    anghami: { icon: faMusic, label: 'Anghami' },
    rss: { icon: faRss, label: 'RSS' },
    website: { icon: faGlobe, label: 'Website' },
};

function formatDate(iso: string, language: HubContentLanguage) {
    const locale = language === 'ar' ? 'ar' : undefined;
    return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

// Turn a heading's text into a stable, URL-safe anchor id. Keeps Unicode
// letters/numbers (so Arabic headings get readable ids too) and falls back to a
// positional id when a heading has no sluggable characters.
function slugifyHeading(text: string, index: number) {
    const base = text
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '');
    return base || `section-${index + 1}`;
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
        platforms,
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
    const isPodcast = kind === 'podcast';
    const isRead = kind === 'read';
    const isArticle = kind === 'article';

    // For podcasts, pull the first top-level episode flagged `featured` out of
    // the body so it can be pinned as a large player above the rest, and hide
    // it from the regular episode list below.
    const featuredEpisode = isPodcast
        ? (body?.find(
              (node): node is RichPodcastEpisode => node._type === 'podcastEpisode' && Boolean(node.featured),
          ) ?? undefined)
        : undefined;
    // For reading lists, pull the first `featured` reading item out to render it
    // as an emphasized "lead pick" above the numbered list.
    const featuredRead = isRead
        ? (body?.find(
              (node): node is RichReadingItem => node._type === 'readingItem' && Boolean(node.featured),
          ) ?? undefined)
        : undefined;
    const displayBody: RichContentNode[] = (body ?? []).filter(
        (node) => node !== featuredEpisode && node !== featuredRead,
    );
    const resolvedPlatforms = (platforms ?? []).filter((p) => PLATFORM_META[p.platform]);
    const readingCount = isRead
        ? (body ?? []).filter((node) => node._type === 'readingItem').length
        : 0;
    // For channels, split the body into embedded videos (rendered in an
    // adaptive grid below) and any other blocks (an optional intro, shown
    // above the grid as normal rich content).
    const channelVideos = isChannel
        ? (body ?? []).filter((node): node is RichYouTube => node._type === 'youtube')
        : [];
    const channelIntro = isChannel ? (body ?? []).filter((node) => node._type !== 'youtube') : [];
    const videoCount = channelVideos.length;
    // Pin the first `featured` video full-width above the grid; the rest fill
    // the adaptive grid.
    const featuredVideo = channelVideos.find((video) => Boolean(video.featured)) ?? undefined;
    const gridVideos = featuredVideo
        ? channelVideos.filter((video) => video !== featuredVideo)
        : channelVideos;

    const hasBody = Boolean(displayBody && displayBody.length > 0);
    const resolvedCategories = categories.filter((category): category is HubEntryCategoryRef => Boolean(category));

    // Article "On this page" TOC: collect h2/h3 headings from the body and give
    // each a stable anchor id. `headingIds` (keyed by block `_key`) is threaded
    // into RichContent so the rendered headings carry the same ids the TOC
    // links/scroll-spy target.
    const articleHeadings: TocHeading[] = [];
    const headingIds: Record<string, string> = {};
    if (isArticle) {
        const seen = new Map<string, number>();
        displayBody.forEach((node, index) => {
            if (node._type !== 'block' || (node.style !== 'h2' && node.style !== 'h3')) return;
            const text = node.children
                .filter((child): child is { _type: 'span'; _key: string; text: string } => child._type === 'span')
                .map((child) => child.text)
                .join('')
                .trim();
            if (!text) return;
            let id = slugifyHeading(text, index);
            const count = seen.get(id) ?? 0;
            seen.set(id, count + 1);
            if (count > 0) id = `${id}-${count}`;
            headingIds[node._key] = id;
            articleHeadings.push({ id, text, level: node.style === 'h3' ? 3 : 2 });
        });
    }

    return (
        <article
            className={cx(styles.article, isRTL && styles.rtl)}
            style={accentStyle(kind)}
            dir={isRTL ? 'rtl' : undefined}
            lang={language}
        >
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
                {isChannel && videoCount > 0 && (
                    <Text className={styles.date}>
                        {videoCount} {videoCount === 1 ? 'video' : 'videos'}
                    </Text>
                )}
            </div>

            {isChannel ? (
                <div className={styles.channelHero}>
                    <div className={styles.channelBanner} aria-hidden="true" />
                    <div className={styles.channelId}>
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
                </div>
            ) : isPodcast ? (
                <div className={styles.podcastHero}>
                    {image && (
                        <img className={styles.podcastCover} src={image} alt="" />
                    )}
                    <div className={styles.podcastInfo}>
                        <Text variant="h1" className={styles.podcastName}>
                            {title}
                        </Text>
                        {sourceName && <Text className={styles.podcastHost}>{sourceName}</Text>}
                        {excerpt && <Text className={styles.podcastTagline}>{excerpt}</Text>}
                        {resolvedPlatforms.length > 0 && (
                            <div className={styles.platforms}>
                                {resolvedPlatforms.map((platform) => {
                                    const meta = PLATFORM_META[platform.platform];
                                    return (
                                        <a
                                            key={platform.platform + platform.url}
                                            href={platform.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.platformPill}
                                        >
                                            <FontAwesomeIcon icon={meta.icon} />
                                            <span>{meta.label}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            ) : isRead ? (
                <div className={styles.readHero}>
                    <Text variant="h1">{title}</Text>
                    <Text className={styles.excerpt}>{excerpt}</Text>
                    {readingCount > 0 && (
                        <span className={styles.readCount}>
                            {readingCount} {readingCount === 1 ? 'article' : 'articles'}
                        </span>
                    )}
                </div>
            ) : isArticle ? (
                <>
                    <Text variant="h1">{title}</Text>
                    <div className={styles.byline}>
                        <span className={styles.bylineAvatar} aria-hidden="true">
                            SE
                        </span>
                        <div className={styles.bylineText}>
                            <Text className={styles.bylineName}>Shawky Ebrahim</Text>
                            <Text className={styles.bylineSub}>
                                Software Engineer · {formatDate(publishedAt, language)}
                            </Text>
                        </div>
                    </div>
                    <Text className={styles.lede}>{excerpt}</Text>
                </>
            ) : (
                <>
                    <Text variant="h1">{title}</Text>
                    <Text className={styles.excerpt}>{excerpt}</Text>
                </>
            )}

            {resolvedCategories.length > 0 && (
                <ListButtons elements={resolvedCategories.map((category) => category.title)} />
            )}

            {!isChannel && !isPodcast && !isRead && image && (
                <div className={styles.imageFrame}>
                    <img className={styles.image} src={image} alt="" />
                </div>
            )}

            {!isChannel && !isPodcast && !isRead && externalUrl && (
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

            {isPodcast && featuredEpisode && <PodcastEpisode value={featuredEpisode} />}

            {isChannel && channelIntro.length > 0 && <RichContent value={channelIntro} />}

            {isChannel && videoCount > 0 && (
                <>
                    {featuredVideo && (
                        <div className={styles.featuredLead}>
                            <span className={styles.featuredTag}>
                                <FontAwesomeIcon icon={faStar} /> Featured
                            </span>
                            <YouTube value={featuredVideo} variant="row" />
                        </div>
                    )}
                    {gridVideos.length > 0 && (
                        <>
                            <Text variant="h3" className={styles.channelBodyHeading}>
                                Videos worth watching
                            </Text>
                            <div className={styles.videoGrid}>
                                {gridVideos.map((video) => (
                                    <YouTube key={video._key} value={video} variant="stack" />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            {isPodcast && hasBody && (
                <Text variant="h3" className={styles.channelBodyHeading}>
                    Episodes
                </Text>
            )}

            {isRead && featuredRead && (
                <div className={styles.featuredLead}>
                    <span className={styles.featuredTag}>
                        <FontAwesomeIcon icon={faStar} /> Featured
                    </span>
                    <ReadingItem value={featuredRead} variant="featured" />
                </div>
            )}

            {isRead && hasBody && (
                <Text variant="h3" className={styles.channelBodyHeading}>
                    Worth reading
                </Text>
            )}

            {!isChannel && hasBody &&
                (isArticle ? (
                    <div className={styles.articleProse}>
                        {articleHeadings.length > 0 && (
                            <ArticleToc
                                headings={articleHeadings}
                                label={isRTL ? 'في هذه الصفحة' : 'On this page'}
                            />
                        )}
                        <RichContent value={displayBody} headingIds={headingIds} />
                    </div>
                ) : (
                    <RichContent value={displayBody} />
                ))}

            {tags && tags.length > 0 && <ListButtons elements={tags} />}
        </article>
    );
}

export default memo(EntryDetail);

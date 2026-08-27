import { memo } from 'react';
import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import StarBorder from '../../components/StarBorder';
import buttonStyles from '../../components/Button/Button.module.css';
import { cx } from '../../utils/cx';
import { resolveRemoteImageStyle, type RemoteImageCrop } from '../../utils/remoteImageCrop';
import type { HubContentLanguage } from '../../Types';
import styles from './HubTeaser.module.css';

export type MagazineTeaserItem = {
    readonly key: string;
    readonly href: string;
    readonly external?: boolean;
    readonly title: string;
    readonly excerpt: string;
    readonly image?: string;
    readonly coverFocus?: RemoteImageCrop;
    readonly avatar?: string;
    readonly avatarFocus?: RemoteImageCrop;
    readonly accent: string;
    readonly badgeIcon: IconDefinition;
    readonly badgeLabel: string;
    readonly language?: HubContentLanguage;
    readonly hidden?: boolean;
};

type MagazineTeaserProps = {
    readonly title: string;
    readonly subtitle: string;
    readonly ctaHref: string;
    readonly ctaLabel: string;
    readonly ctaEvent?: string;
    readonly items: MagazineTeaserItem[];
    readonly variant?: 'magazine' | 'people';
};

function initialFor(title: string) {
    const trimmed = title.trim();
    return trimmed ? trimmed.slice(0, 1).toUpperCase() : '?';
}

function linkProps(item: MagazineTeaserItem) {
    return {
        href: item.href,
        target: item.external ? '_blank' : undefined,
        rel: item.external ? 'noopener noreferrer' : undefined,
        style: { '--a': item.accent } as CSSProperties,
        'data-clarity-event': item.external ? 'follow' : undefined,
    };
}

function HiddenPill({ hidden }: { readonly hidden?: boolean }) {
    if (!hidden) return null;
    return (
        <span className={styles.hiddenPill} title="Hidden from production — visible only in preview mode">
            <FontAwesomeIcon icon={faEyeSlash} />
            Hidden
        </span>
    );
}

function ItemCopy({
    item,
    titleClassName,
    excerptClassName,
}: {
    readonly item: MagazineTeaserItem;
    readonly titleClassName: string;
    readonly excerptClassName?: string;
}) {
    const isRTL = item.language === 'ar';
    return (
        <>
            <span className={styles.badge}>
                <FontAwesomeIcon icon={item.badgeIcon} />
                {item.badgeLabel}
            </span>
            <h4
                className={cx(titleClassName, isRTL && styles.rtl)}
                dir={isRTL ? 'rtl' : undefined}
                lang={item.language}
            >
                {item.title}
            </h4>
            {excerptClassName && item.excerpt ? (
                <p
                    className={cx(excerptClassName, isRTL && styles.rtl)}
                    dir={isRTL ? 'rtl' : undefined}
                    lang={item.language}
                >
                    {item.excerpt}
                </p>
            ) : null}
        </>
    );
}

function Avatar({ item }: { readonly item: MagazineTeaserItem }) {
    return (
        <span className={styles.avatarWrap} aria-hidden="true">
            {item.avatar ? (
                <img
                    className={styles.avatarImg}
                    src={item.avatar}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={resolveRemoteImageStyle(item.avatarFocus, 'center')}
                />
            ) : (
                <span className={styles.avatarFallback}>{initialFor(item.title)}</span>
            )}
        </span>
    );
}

function RowMark({ item }: { readonly item: MagazineTeaserItem }) {
    if (item.image) {
        return (
            <span
                className={styles.rowThumb}
                style={{ backgroundImage: `url(${item.image})` }}
                aria-hidden="true"
            />
        );
    }
    return (
        <span className={styles.rowMark} aria-hidden="true">
            {initialFor(item.title)}
        </span>
    );
}

const SIDE_LIMIT = 3;

function EntryRow({ item }: { readonly item: MagazineTeaserItem }) {
    return (
        <a className={styles.row} {...linkProps(item)}>
            <HiddenPill hidden={item.hidden} />
            <RowMark item={item} />
            <span className={styles.rowBody}>
                <ItemCopy item={item} titleClassName={styles.title} excerptClassName={styles.excerpt} />
            </span>
        </a>
    );
}

function MagazineTeaser({ title, subtitle, ctaHref, ctaLabel, ctaEvent, items, variant = 'magazine' }: MagazineTeaserProps) {
    if (items.length === 0) return null;

    const isPeople = variant === 'people';
    const [featured, ...rest] = items;
    const side = rest.slice(0, SIDE_LIMIT);
    const below = rest.slice(SIDE_LIMIT);

    return (
        <div className={cx(styles.teaser, isPeople && styles.people)}>
            <div className={styles.kicker}>
                <h3 className={styles.kickerTitle}>{title}</h3>
                <span className={styles.kickerSub}>{subtitle}</span>
            </div>

            {isPeople ? (
                <div className={styles.peopleGrid}>
                    {items.map((item) => (
                        <a key={item.key} className={styles.person} {...linkProps(item)}>
                            <HiddenPill hidden={item.hidden} />
                            <Avatar item={item} />
                            <span className={styles.personBody}>
                                <ItemCopy item={item} titleClassName={styles.title} excerptClassName={styles.excerpt} />
                            </span>
                        </a>
                    ))}
                </div>
            ) : (
                <div className={styles.board}>
                    <div className={cx(styles.split, side.length === 0 && styles.splitSolo)}>
                        <a className={styles.poster} {...linkProps(featured)}>
                            {featured.image ? (
                                <span
                                    className={styles.posterPhoto}
                                    style={{ backgroundImage: `url(${featured.image})` }}
                                    aria-hidden="true"
                                />
                            ) : (
                                <span className={styles.posterGhost} aria-hidden="true">
                                    {initialFor(featured.title)}
                                </span>
                            )}
                            <HiddenPill hidden={featured.hidden} />
                            <ItemCopy
                                item={featured}
                                titleClassName={styles.posterTitle}
                                excerptClassName={styles.excerpt}
                            />
                        </a>
                        {side.length > 0 && (
                            <div className={styles.rows}>
                                {side.map((item) => (
                                    <EntryRow key={item.key} item={item} />
                                ))}
                            </div>
                        )}
                    </div>
                    {below.length > 0 && (
                        <div className={styles.below}>
                            {below.map((item) => (
                                <EntryRow key={item.key} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className={styles.foot}>
                <StarBorder>
                    <a
                        href={ctaHref}
                        className={cx(buttonStyles.button, buttonStyles.md, buttonStyles.pointer, styles.cta)}
                        data-clarity-event={ctaEvent}
                    >
                        {ctaLabel}
                        <FontAwesomeIcon icon={faArrowRight} />
                    </a>
                </StarBorder>
            </div>
        </div>
    );
}

export default memo(MagazineTeaser);

import { memo } from 'react';
import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import StarBorder from '../../components/StarBorder';
import buttonStyles from '../../components/Button/Button.module.css';
import { cx } from '../../utils/cx';
import { resolveRemoteImageStyle, resolveYouTubeBannerUrl, type RemoteImageCrop } from '../../utils/remoteImageCrop';
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
    readonly items: MagazineTeaserItem[];
    readonly variant?: 'magazine' | 'people';
};

function initialFor(title: string) {
    const trimmed = title.trim();
    return trimmed ? trimmed.slice(0, 1).toUpperCase() : '?';
}

function MagazineTeaser({ title, subtitle, ctaHref, ctaLabel, items, variant = 'magazine' }: MagazineTeaserProps) {
    if (items.length === 0) return null;

    const isPeople = variant === 'people';
    const ordered = isPeople
        ? items
        : (() => {
              const heroIndex = Math.max(
                  0,
                  items.findIndex((item) => Boolean(item.image)),
              );
              const hero = items[heroIndex];
              const rest = items.filter((_, index) => index !== heroIndex);
              return [hero, ...rest];
          })();

    return (
        <div className={cx(styles.teaser, isPeople && styles.people)}>
            <div className={styles.kicker}>
                <h3 className={styles.kickerTitle}>{title}</h3>
                <span className={styles.kickerSub}>{subtitle}</span>
            </div>

            <div className={styles.grid}>
                {ordered.map((item, index) => {
                    const isFeat = index === 0;
                    const showCover = isFeat && Boolean(item.image);
                    const isRTL = item.language === 'ar';

                    return (
                        <a
                            key={item.key}
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className={cx(styles.cell, isFeat && styles.feat)}
                            style={{ '--a': item.accent } as CSSProperties}
                        >
                            {showCover ? (
                                isPeople ? (
                                    <span className={styles.peopleCover} aria-hidden="true">
                                        <img
                                            src={resolveYouTubeBannerUrl(item.image!)}
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                            style={resolveRemoteImageStyle(item.coverFocus)}
                                        />
                                    </span>
                                ) : (
                                    <span
                                        className={styles.bg}
                                        style={{ backgroundImage: `url(${item.image})` }}
                                        aria-hidden="true"
                                    />
                                )
                            ) : (
                                <span className={styles.tint} aria-hidden="true" />
                            )}
                            <span className={styles.rail} aria-hidden="true" />
                            <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
                            {item.hidden && (
                                <span
                                    className={styles.hiddenPill}
                                    title="Hidden from production — visible only in preview mode"
                                >
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                    Hidden
                                </span>
                            )}
                            {isPeople && (
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
                            )}
                            <span className={styles.badge}>
                                <FontAwesomeIcon icon={item.badgeIcon} />
                                {item.badgeLabel}
                            </span>
                            <h4
                                className={cx(styles.title, isRTL && styles.rtl)}
                                dir={isRTL ? 'rtl' : undefined}
                                lang={item.language}
                            >
                                {item.title}
                            </h4>
                            <p
                                className={cx(styles.excerpt, isRTL && styles.rtl)}
                                dir={isRTL ? 'rtl' : undefined}
                                lang={item.language}
                            >
                                {item.excerpt}
                            </p>
                        </a>
                    );
                })}
            </div>

            <div className={styles.foot}>
                <StarBorder>
                    <a
                        href={ctaHref}
                        className={cx(buttonStyles.button, buttonStyles.md, buttonStyles.pointer, styles.cta)}
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

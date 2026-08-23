import { memo } from 'react';
import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import StarBorder from '../../components/StarBorder';
import buttonStyles from '../../components/Button/Button.module.css';
import { cx } from '../../utils/cx';
import type { HubContentLanguage } from '../../Types';
import styles from './HubTeaser.module.css';

export type MagazineTeaserItem = {
    readonly key: string;
    readonly href: string;
    readonly external?: boolean;
    readonly title: string;
    readonly excerpt: string;
    readonly image?: string;
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
};

function MagazineTeaser({ title, subtitle, ctaHref, ctaLabel, items }: MagazineTeaserProps) {
    if (items.length === 0) return null;

    const heroIndex = Math.max(
        0,
        items.findIndex((item) => Boolean(item.image)),
    );
    const hero = items[heroIndex];
    const rest = items.filter((_, index) => index !== heroIndex);
    const ordered = [hero, ...rest];

    return (
        <div className={styles.teaser}>
            <div className={styles.kicker}>
                <h3 className={styles.kickerTitle}>{title}</h3>
                <span className={styles.kickerSub}>{subtitle}</span>
            </div>

            <div className={styles.grid}>
                {ordered.map((item, index) => {
                    const isFeat = index === 0;
                    const showBg = isFeat && Boolean(item.image);
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
                            {showBg ? (
                                <span
                                    className={styles.bg}
                                    style={{ backgroundImage: `url(${item.image})` }}
                                    aria-hidden="true"
                                />
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

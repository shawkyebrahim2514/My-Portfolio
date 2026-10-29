import { memo } from 'react';
import type { SanityAboutPage } from '../../../Types';
import RichContent from '../../../components/RichContent';
import { cx } from '../../../utils/cx';
import styles from './Content.module.css';

function Content({
    description,
    resume,
    showActions = false,
}: Readonly<Pick<SanityAboutPage, 'description' | 'resume'> & { showActions?: boolean }>) {
    return (
        <div className={cx(styles.content, showActions && styles.intro)}>
            <div className={showActions ? styles.identity : undefined}>
                <RichContent
                    value={description}
                    headingLevel={showActions ? 1 : 2}
                    headingsAs={showActions ? 'p' : undefined}
                />
            </div>
            {showActions && (
                <>
                    <p className={styles.summary}>
                        I build cross-platform SDKs that help developers ship faster, more
                        accessible apps.
                    </p>
                    <nav className={styles.actions} aria-label="Portfolio actions">
                        {resume?.link && (
                            <a
                                href={resume.link}
                                className={cx(styles.action, styles.primary)}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-clarity-event="resume"
                                data-clarity-upgrade="resume"
                            >
                                See my resume
                            </a>
                        )}
                        <a
                            href="/experience"
                            className={cx(
                                styles.action,
                                resume?.link ? styles.secondary : styles.primary
                            )}
                            data-clarity-event="experience"
                        >
                            Explore my experience
                        </a>
                        <a
                            href="/contacts"
                            className={cx(styles.action, styles.contact)}
                            data-clarity-event="contact"
                        >
                            Get in touch
                        </a>
                    </nav>
                </>
            )}
        </div>
    );
}

export default memo(Content);

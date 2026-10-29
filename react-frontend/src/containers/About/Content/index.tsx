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
                        Cross-platform development with a focus on performance, accessibility, and
                        developer experience.
                    </p>
                    <nav className={styles.actions} aria-label="Portfolio actions">
                        <a
                            href="/projects"
                            className={cx(styles.action, styles.primary)}
                            data-clarity-event="projects"
                        >
                            Explore projects
                        </a>
                        {resume?.link && (
                            <a
                                href={resume.link}
                                className={cx(styles.action, styles.secondary)}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-clarity-event="resume"
                                data-clarity-upgrade="resume"
                            >
                                {resume.text || 'View resume'}
                            </a>
                        )}
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

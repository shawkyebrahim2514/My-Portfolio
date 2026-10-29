import { memo } from 'react';
import type { SanityAboutPage } from '../../../Types';
import RichContent from '../../../components/RichContent';
import { cx } from '../../../utils/cx';
import buttonStyles from '../../../components/Button/Button.module.css';
import styles from './Content.module.css';

function Content({
    description,
    resume,
    showActions = false,
}: Readonly<Pick<SanityAboutPage, 'description' | 'resume'> & { showActions?: boolean }>) {
    const actionClass = cx(buttonStyles.button, buttonStyles.lg, buttonStyles.pointer);
    return (
        <div className={styles.content}>
            <RichContent
                value={description}
                headingLevel={showActions ? 1 : 2}
                headingsAs={showActions ? 'p' : undefined}
            />
            {showActions && (
                <>
                    <p className={styles.summary}>
                        Cross-platform development with a focus on performance, accessibility, and
                        developer experience.
                    </p>
                    <nav className={styles.actions} aria-label="Portfolio actions">
                        <a href="/projects" className={actionClass} data-clarity-event="projects">
                            Explore projects
                        </a>
                        {resume?.link && (
                            <a
                                href={resume.link}
                                className={actionClass}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-clarity-event="resume"
                                data-clarity-upgrade="resume"
                            >
                                {resume.text || 'View resume'}
                            </a>
                        )}
                        <a href="/contacts" className={actionClass} data-clarity-event="contact">
                            Get in touch
                        </a>
                    </nav>
                </>
            )}
        </div>
    );
}

export default memo(Content);

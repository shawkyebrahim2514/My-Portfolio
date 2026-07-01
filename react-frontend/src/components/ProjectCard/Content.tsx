import { memo } from 'react'
import ListButtons from '../ListButtons';
import ProjectButton from './Image/ImageOverlay/ProjectButton';
import DemoButton from './Image/ImageOverlay/DemoButton';
import HTMLMarkdown from '../HTMLMarkdown';
import styles from './Content.module.css';

type ContentProps = {
    readonly title?: string,
    readonly description: string,
    readonly technologies: string[],
    readonly projectLink?: string,
    readonly demoLink?: string,
}

function Content({ description, technologies, projectLink, demoLink }: ContentProps) {
    return (
        <div className={styles.content}>
            <HTMLMarkdown markdown={description} />
            <div className={styles.links}>
                {projectLink && <ProjectButton projectLink={projectLink} />}
                {demoLink && <DemoButton demoLink={demoLink} />}
            </div>
            <ListButtons elements={technologies} />
        </div>
    )
}

export default memo(Content);
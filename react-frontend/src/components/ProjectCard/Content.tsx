import { memo } from 'react'
import ListButtons from '../ListButtons';
import ProjectButton from './Image/ImageOverlay/ProjectButton';
import DemoButton from './Image/ImageOverlay/DemoButton';
import RichContent from '../RichContent';
import type { RichContentNode } from '../../Types';
import styles from './Content.module.css';

type ContentProps = {
    readonly title?: string,
    readonly description: RichContentNode[],
    readonly technologies: string[],
    readonly projectLink?: string,
    readonly demoLink?: string,
}

function Content({ description, technologies, projectLink, demoLink }: ContentProps) {
    return (
        <div className={styles.content}>
            <RichContent value={description} />
            <div className={styles.links}>
                {projectLink && <ProjectButton projectLink={projectLink} />}
                {demoLink && <DemoButton demoLink={demoLink} />}
            </div>
            <ListButtons elements={technologies} />
        </div>
    )
}

export default memo(Content);
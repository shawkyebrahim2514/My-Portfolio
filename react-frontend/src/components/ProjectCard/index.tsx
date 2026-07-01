import { memo } from 'react'
import Image from './Image';
import Content from './Content';
import { cx } from '../../utils/cx';
import surfaces from '../../styles/surfaces.module.css';
import styles from './ProjectCard.module.css';

type ProjectCardProps = {
    readonly imgSrc?: string,
    readonly projectLink?: string,
    readonly demoLink?: string,
    readonly title?: string,
    readonly description: string,
    readonly technologies: string[],
}

function ProjectCard({
    imgSrc = "images/placeholder.png",
    projectLink,
    demoLink,
    description,
    technologies
}: ProjectCardProps) {
    return (
        <div className={cx(surfaces.container, styles.card)}>
            <Image imgSrc={imgSrc || "images/placeholder.png"} />
            <Content 
                description={description} 
                technologies={technologies}
                projectLink={projectLink}
                demoLink={demoLink} />
        </div>
    )
}

export default memo(ProjectCard);
import { memo } from "react"
import { SanityProjectsPage } from "../../Types"
import ProjectCard from "../../components/ProjectCard"

function Content({ projects }: Readonly<Pick<SanityProjectsPage, "projects">>) {
    return (
        <>
            {projects.map((project) => {
                return (
                    <ProjectCard
                        key={project.description}
                        imgSrc={project.imgSrc}
                        description={project.description}
                        projectLink={project.links.projectLink}
                        demoLink={project.links.demoLink}
                        technologies={project.technologies}
                    />
                )
            })}
        </>
    )
}

export default memo(Content)
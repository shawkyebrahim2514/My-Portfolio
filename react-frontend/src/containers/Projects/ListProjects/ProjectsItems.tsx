import { memo } from "react";
import ProjectCard from "../../../components/ProjectCard";
import { Project } from "../../../Types";

type ProjectsItemsProps = {
    readonly projects: Project[]
}

function ProjectsItems({ projects }: ProjectsItemsProps) {
    return (
        <>
            {projects.map((project, index) => {
                return (
                    <ProjectCard
                        key={project.name}
                        imgSrc={project.imgSrc}
                        title={project.name}
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

export default memo(ProjectsItems);
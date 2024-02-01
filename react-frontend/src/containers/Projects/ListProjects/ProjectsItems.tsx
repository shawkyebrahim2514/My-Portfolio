import ProjectCard from "../../../components/ProjectCard";
import { Project } from "../../../Types";

export default function ProjectsItems({ projects }: { projects: Project[] }) {
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
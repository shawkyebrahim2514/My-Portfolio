import ProjectCard from "../../../components/ProjectCard"

export default function ListProjects({ list }) {
    return (
        <>
            {list.map((project, index) => {
                return (
                    <ProjectCard
                        key={project.title}
                        imgSrc={project.imgSrc}
                        title={project.title}
                        description={project.description}
                        projectLink={project.projectLink}
                        demoLink={project.demoLink}
                        technologies={project.technologies}
                    />
                )
            })}
        </>
    )
}

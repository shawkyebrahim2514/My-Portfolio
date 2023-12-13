import { useEffect, useState } from "react";
import ProjectCard from "../../../components/ProjectCard"
import { getProjects } from '../../../APIs';
import { Project } from "../../../Types";

export default function ListProjects() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        getProjects().then((result) => {
            result = result.sort((element1, element2) => {
                return element2.rank - element1.rank;
            });
            let newState: Project[] = [];
            result.forEach((element) => {
                newState.push({
                    description: element.description,
                    name: element.name,
                    technologies: element.technologies,
                    links: {
                        demoLink: element.links?.demoLink,
                        projectLink: element.links?.projectLink,
                    },
                    imgSrc: element.imgSrc,
                })
            })
            setProjects(newState);
        })
    }, [])

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

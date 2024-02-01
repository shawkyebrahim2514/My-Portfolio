import { useEffect, useState } from "react";
import { getProjects } from '../../../APIs';
import { Project, SanityProject } from "../../../Types";
import Loader from "../../../components/Loader";
import ProjectsItems from "./ProjectsItems";

export default function ListProjects() {
    const [projects, setProjects] = useState<Project[] | null>(null);

    useEffect(() => {
        getProjects().then((result) => {
            result = sortResultFromSanity(result);
            let newState: Project[] = [];
            result.forEach((element) => {
                newState.push(formatProjectItemFromSanity(element));
            })
            setProjects(newState);
        })
    }, []);

    return (
        <>
            {projects ? <ProjectsItems projects={projects} /> : <Loader />}
        </>
    )
}

function sortResultFromSanity(result: SanityProject[]): SanityProject[] {
    return result.sort((element1, element2) => {
        return element2.rank - element1.rank;
    });
}

function formatProjectItemFromSanity(element: SanityProject): Project {
    return {
        description: element.description,
        name: element.name,
        technologies: element.technologies,
        links: {
            demoLink: element.links?.demoLink,
            projectLink: element.links?.projectLink,
        },
        imgSrc: element.imgSrc,
    }
}
import { useEffect, useMemo, useState } from 'react'
import ContainerWrap from '../../components/ContainerWrap';
import SectionTitle from '../../components/SectionTitle';
import { getProjects } from '../../APIs';
import ListProjects from './ListProjects';

function Projects() {
    const [projects, setProjects] = useState([]);
    const containerStyle = useMemo(() => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getProjects().then((result) => {
            result = result.sort((element1, element2) => {
                return element2.rank - element1.rank;
            });
            let newState = [];
            result.forEach((element) => {
                newState.push({
                    description: element.description,
                    title: element.name,
                    technologies: element.languages,
                    demoLink: element.links?.demoLink,
                    projectLink: element.links?.projectLink,
                    imgSrc: element.imgSrc,
                })
            })
            setProjects(newState);
        })
    }, [])

    return (
        <div style={containerStyle}>
            {/* Title */}
            <SectionTitle
                highlightedText={"Projects"}
                text={"I have built"} />

            {/* Content */}
            <ListProjects list={projects} />
        </div>
    )
}

export default ContainerWrap(Projects)

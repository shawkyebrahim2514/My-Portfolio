import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import Content from './Content';
import { useEffect, useMemo, useState } from 'react';
import { getSkills } from '../../APIs';

function Skills() {
    const [technologies, setTechnologies] = useState({
        "General": [],
        "Frontend": [],
        "Backend": [],
        "Databases": [],
        "Tools": [],
    });
    const containerStyle = useMemo(() => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getSkills().then((result) => {
            result = result.sort((element1, element2) => {
                return element1.rank - element2.rank;
            });
            let newState = {}
            result.forEach((element) => {
                if (newState[element.categoryName]) {
                    newState[element.categoryName].push({
                        src: element.iconURL,
                        name: element.name,
                    })
                } else {
                    newState[element.categoryName] = [{
                        src: element.iconURL,
                        name: element.name,
                    }]
                }
            })
            setTechnologies(newState)
        })
    }, [])

    return (
        <div style={containerStyle}>
            {/* Title */}
            <SectionTitle
                highlightedText={"Skills & Tools"}
                text={"I have experience with"} />

            {/* Content */}
            <Content list={Object.entries(technologies)} />
        </div>
    )
}

export default ContainerWrap(Skills)
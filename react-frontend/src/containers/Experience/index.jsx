import { useEffect, useMemo, useState } from 'react'
import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import { getInternships } from '../../APIs'
import ListExperiences from './ListExperiences';


function Experience() {
    const [experiences, setExperiences] = useState([]);
    const containerStyle = useMemo(() => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getInternships().then((result) => {
            result = result.sort((element1, element2) => {
                return element2.rank - element1.rank;
            });
            let newState = [];
            result.forEach((element) => {
                newState.push({
                    description: element.description,
                    title: element.title,
                    subtitle: element.subTitle,
                    technologies: element.languages,
                    link: element.link,
                    date: element.date,
                })
            })
            setExperiences(newState);
        });
    }, []);

    return (
        <div style={containerStyle}>
            {/* Title */}
            <SectionTitle
                highlightedText={"Internships & Training"}
                text={"I have taken"} />

            {/* Content */}
            <ListExperiences list={experiences} />
        </div>
    )
}

export default ContainerWrap(Experience)

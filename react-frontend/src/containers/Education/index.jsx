import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import MainSection from '../../components/MainSection'
import { useEffect, useMemo, useState } from 'react';
import { getEducationCourses } from '../../APIs'
import MainSectionContent from './MainSectionContent';

function Contacts() {
    const [courses, setCourses] = useState([]);
    const containerStyle = useMemo(() => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getEducationCourses().then((result) => {
            result = result.sort((element1, element2) => {
                return element2.rank - element1.rank;
            });
            let newState = []
            result.forEach((element) => {
                newState.push({
                    description: element.description,
                    name: element.name,
                    technolgoies: element.languages,
                })
            })
            setCourses(newState);
        });
    }, []);

    return (
        <div style={containerStyle}>
            {/* Title */}
            <SectionTitle
                highlightedText={"Education & Certifications"}
                text={"I have got"} />

            {/* Content */}
            <MainSection
                title="Faculty of Computer and Artificial Intelligence - Cairo University"
                subtitle="BSc in Computer Science | GPA: 3.74">
                <MainSectionContent courses={courses} />
            </MainSection>
        </div>
    )
}

export default ContainerWrap(Contacts)

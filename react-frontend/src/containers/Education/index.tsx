import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import MainSection from '../../components/MainSection'
import { CSSProperties, useMemo } from 'react';
import MainSectionContent from './MainSectionContent';
import { educationPageContent } from '../../Texts';

function Education() {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);


    return (
        <div style={containerStyle}>
            {/* Title */}
            <SectionTitle
                highlightedText={educationPageContent.highlightedTitle}
                text={educationPageContent.titlePhrase} />

            {/* Content */}
            <MainSection
                title={educationPageContent.college.name}
                subtitle={createCollegePhrase()}>
                <MainSectionContent />
            </MainSection>
        </div>
    )
}

function createCollegePhrase() {
    return educationPageContent.college.degree + " | " + educationPageContent.college.gpa;
}

export default ContainerWrap(Education)

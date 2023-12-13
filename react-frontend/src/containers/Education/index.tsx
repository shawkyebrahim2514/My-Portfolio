import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import MainSection from '../../components/MainSection'
import { CSSProperties, useMemo } from 'react';
import MainSectionContent from './MainSectionContent';
import { educationPageContent } from '../../Texts';

function Contacts() {
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
                subtitle={educationPageContent.college.degree + " | " + educationPageContent.college.gpa}>
                <MainSectionContent />
            </MainSection>
        </div>
    )
}

export default ContainerWrap(Contacts)

import { CSSProperties, useMemo } from 'react'
import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import ListExperiences from './ListExperiences';
import { experiencePageContent } from '../../Texts';

function Experience() {
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
                highlightedText={experiencePageContent.highlightedTitle}
                text={experiencePageContent.titlePhrase} />

            {/* Content */}
            <ListExperiences />
        </div>
    )
}

export default ContainerWrap(Experience)

import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import Content from './Content';
import { CSSProperties, useMemo } from 'react';
import { skillsPageContent } from '../../Texts';

function Skills() {
    const containerStyle = useMemo(():CSSProperties => ({
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
                highlightedText={skillsPageContent.highlightedTitle}
                text={skillsPageContent.titlePhrase} />

            {/* Content */}
            <Content />
        </div>
    )
}

export default ContainerWrap(Skills)
import { CSSProperties, useMemo } from 'react'
import ContainerWrap from '../../components/ContainerWrap';
import SectionTitle from '../../components/SectionTitle';
import ListProjects from './ListProjects';
import { projectsPageContent } from '../../Texts';

function Projects() {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    return (
        <div style={containerStyle}>
            <SectionTitle
                highlightedText={projectsPageContent.highlightedTitle}
                text={projectsPageContent.titlePhrase} />
            <ListProjects />
        </div>
    )
}

export default ContainerWrap(Projects)

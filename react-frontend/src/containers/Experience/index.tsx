import { CSSProperties, useMemo } from 'react'
import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import ListInternships from './ListInternships';
import { experiencePageContent } from '../../Texts';
import ListCertificates from './ListCertificates';

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
            <InternshipsAndTraining />
            <Certificates />
        </div>
    )
}

function InternshipsAndTraining() {
    return (
        <>
            <SectionTitle
                highlightedText={experiencePageContent.internships.highlightedTitle}
                text={experiencePageContent.internships.titlePhrase} />
            <ListInternships />
        </>
    )
}

function Certificates() {
    return (
        <>
            <SectionTitle
                highlightedText={experiencePageContent.certificates.highlightedTitle}
                text={experiencePageContent.certificates.titlePhrase} />
            <ListCertificates />
        </>
    )
}

export default ContainerWrap(Experience)

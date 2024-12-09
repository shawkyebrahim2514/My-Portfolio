import { CSSProperties, useEffect, useMemo, useState } from 'react'
import ContainerWrap from '../../components/ContainerWrap'
import { SanityExperiencePage } from '../../Types';
import Certificates from './Certificates';
import { getExperiencePage } from '../../APIs';
import Loader from '../../components/Loader';
import Internships from './Internships';
import ProfessionalExperience from './ProfessionalExperience';

function Experience() {
    const [experiences, setExperiences] = useState<SanityExperiencePage | null>(null);
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getExperiencePage().then((result) => {
            setExperiences(result);
        });
    }, []);

    return (
        <>
            {experiences ? (
                <div style={containerStyle}>
                    <ProfessionalExperience professionalExperienceSection={experiences.professionalExperienceSection} />
                    <Internships internshipsSection={experiences.internshipsSection} />
                    <Certificates certificatesSection={experiences.certificatesSection} />
                </div>
            ) : <Loader />}
        </>
    )
}

export default ContainerWrap(Experience)

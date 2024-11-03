import { CSSProperties, useMemo } from "react";
import { SanityExperiencePage } from "../../../Types";
import MainSection from "../../../components/MainSection";
import ExperienceItemDescription from "../ExperienceItemDescription";

function Content({ certificates }: Readonly<Pick<SanityExperiencePage['certificatesSection'], 'certificates'>>) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
    }), []);

    return (
        <>
            {certificates.map((certificate) => {
                return (
                    <MainSection
                        key={certificate.title}
                        title={certificate.title}
                        subtitle={certificate.subTitle}
                        link={certificate.link} >
                        <div style={containerStyle}>
                            {certificate.description && <ExperienceItemDescription description={certificate.description} />}
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}

export default Content;
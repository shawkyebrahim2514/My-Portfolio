import { CSSProperties, useMemo } from "react";
import { SanityExperiencePage } from "../../../Types";
import ExperienceItemDescription from "../ExperienceItemDescription";

function Content({ professionalExperience }: Readonly<Pick<SanityExperiencePage['professionalExperienceSection'], 'professionalExperience'>>) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
    }), []);

    return (
        <>
            {professionalExperience.map((experience) => {
                return (
                    <div style={containerStyle} key={experience.description}>
                        <ExperienceItemDescription description={experience.description} />
                    </div>
                )
            })}
        </>
    )
}

export default Content;
import { CSSProperties, useMemo } from "react";
import { SanityExperiencePage } from "../../../Types";
import ExperienceItemDescription from "../ExperienceItemDescription";

function Content({ internships }: Readonly<Pick<SanityExperiencePage['internshipsSection'], 'internships'>>) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
    }), []);

    return (
        <>
            {internships.map((internship) => {
                return (
                    <div style={containerStyle} key={internship.description}>
                        <ExperienceItemDescription description={internship.description} />
                    </div>
                )
            })}
        </>
    )
}

export default Content;
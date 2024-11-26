import { CSSProperties, useMemo } from "react";
import { SanityExperiencePage } from "../../../Types";
import MainSection from "../../../components/MainSection";
import ExperienceItemDescription from "../ExperienceItemDescription";
import ListButtons from "../../../components/ListButtons";

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
                    <MainSection key={internship.description}>
                        <div style={containerStyle}>
                            <ExperienceItemDescription description={internship.description} />
                            <ListButtons elements={internship.technologies} />
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}

export default Content;
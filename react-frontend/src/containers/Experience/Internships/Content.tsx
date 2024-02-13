import { CSSProperties, useMemo } from "react";
import { SanityExperiencePage } from "../../../Types";
import MainSection from "../../../components/MainSection";
import ExperienceItemInformation from "../ExperienceItemInformation";
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
                    <MainSection
                        key={internship.title}
                        title={internship.title}
                        link={internship.link} >
                        <div style={containerStyle}>
                            <ExperienceItemInformation subTitle={internship.subTitle} date={formatDate(internship.date)} />
                            <ExperienceItemDescription description={internship.description} />
                            <ListButtons elements={internship.technologies} />
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}

function formatDate(date: SanityExperiencePage['internshipsSection']['internships'][0]['date']) {
    return `From: ${date.from} - To: ${date.to}`
}

export default Content;
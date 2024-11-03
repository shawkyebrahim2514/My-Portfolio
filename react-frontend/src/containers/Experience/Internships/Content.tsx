import { CSSProperties, useMemo } from "react";
import { SanityExperiencePage } from "../../../Types";
import MainSection from "../../../components/MainSection";
import ExperienceItemDescription from "../ExperienceItemDescription";
import ListButtons from "../../../components/ListButtons";
import Text from "../../../components/Text";

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
                        subtitle={internship.subTitle}
                        link={internship.link} >
                        <div style={containerStyle}>
                            <Text variant={"body"}>
                                {formatDate(internship.date)}
                            </Text>
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
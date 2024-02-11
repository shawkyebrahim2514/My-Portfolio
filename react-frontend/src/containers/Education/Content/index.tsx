import { memo, useMemo } from "react";
import { SanityEducationPage } from "../../../Types";
import MainSection from "../../../components/MainSection";
import { CSSProperties } from "styled-components";
import EducationInformation from "./EducationInformation";
import CoursesItems from "./CoursesItems";

function Content({ education }: Readonly<Pick<SanityEducationPage, "education">>) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
    }), []);

    return (
        <MainSection
            title={education.name}
            subtitle={education.description}>
            <div style={containerStyle}>
                <EducationInformation location={education.location} date={education.date} />
                <CoursesItems courses={education.courses} />
            </div>
        </MainSection>
    )
}

export default memo(Content);
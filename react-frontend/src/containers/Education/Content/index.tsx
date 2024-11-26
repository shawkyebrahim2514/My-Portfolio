import { CSSProperties, memo, useMemo } from "react";
import { SanityEducationPage } from "../../../Types";
import MainSection from "../../../components/MainSection";
import CoursesItems from "./CoursesItems";
import HTMLMarkdown from "../../../components/HTMLMarkdown";

function Content({ education }: Readonly<Pick<SanityEducationPage, "education">>) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
    }), []);

    return (
        <MainSection
            subtitle={education.description}>
            <div style={containerStyle}>
                <div>
                    <HTMLMarkdown markdown={education.description} />
                </div>
                <CoursesItems courses={education.courses} />
            </div>
        </MainSection>
    )
}

export default memo(Content);
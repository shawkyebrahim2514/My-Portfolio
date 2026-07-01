import { memo } from "react";
import { SanityEducationPage } from "../../../Types";
import MainSection from "../../../components/MainSection";
import CoursesItems from "./CoursesItems";
import HTMLMarkdown from "../../../components/HTMLMarkdown";
import surfaces from "../../../styles/surfaces.module.css";

function Content({ education }: Readonly<Pick<SanityEducationPage, "education">>) {
    return (
        <MainSection
            subtitle={education.description}>
            <div className={surfaces.stack}>
                <div>
                    <HTMLMarkdown markdown={education.description} />
                </div>
                <CoursesItems courses={education.courses} />
            </div>
        </MainSection>
    )
}

export default memo(Content);
import { memo } from "react";
import { SanityEducationPage } from "../../../Types";
import MainSection from "../../../components/MainSection";
import CoursesItems from "./CoursesItems";
import RichContent from "../../../components/RichContent";
import surfaces from "../../../styles/surfaces.module.css";

function Content({ education }: Readonly<Pick<SanityEducationPage, "education">>) {
    return (
        <MainSection>
            <div className={surfaces.stack}>
                <div>
                    <RichContent value={education.description} />
                </div>
                <CoursesItems courses={education.courses} />
            </div>
        </MainSection>
    )
}

export default memo(Content);
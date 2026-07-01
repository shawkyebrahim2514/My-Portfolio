import { SanityExperiencePage } from "../../../Types";
import ExperienceItemDescription from "../ExperienceItemDescription";
import surfaces from "../../../styles/surfaces.module.css";

function Content({ professionalExperience }: Readonly<Pick<SanityExperiencePage['professionalExperienceSection'], 'professionalExperience'>>) {
    return (
        <>
            {professionalExperience.map((experience) => {
                return (
                    <div className={surfaces.stack} key={experience.description}>
                        <ExperienceItemDescription description={experience.description} />
                    </div>
                )
            })}
        </>
    )
}

export default Content;
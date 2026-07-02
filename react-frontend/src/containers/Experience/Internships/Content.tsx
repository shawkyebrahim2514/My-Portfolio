import { SanityExperiencePage } from "../../../Types";
import ExperienceItemDescription from "../ExperienceItemDescription";
import surfaces from "../../../styles/surfaces.module.css";

function Content({ internships }: Readonly<Pick<SanityExperiencePage['internshipsSection'], 'internships'>>) {
    return (
        <>
            {internships.map((internship, index) => {
                return (
                    <div className={surfaces.stack} key={index}>
                        <ExperienceItemDescription description={internship.description} />
                    </div>
                )
            })}
        </>
    )
}

export default Content;
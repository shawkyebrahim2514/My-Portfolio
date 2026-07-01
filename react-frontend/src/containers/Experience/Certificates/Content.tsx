import { SanityExperiencePage } from "../../../Types";
import ExperienceItemDescription from "../ExperienceItemDescription";
import surfaces from "../../../styles/surfaces.module.css";

function Content({ certificates }: Readonly<Pick<SanityExperiencePage['certificatesSection'], 'certificates'>>) {
    return (
        <>
            {certificates.map((certificate) => {
                return (
                    <div className={surfaces.stack} key={certificate.description}>
                        {certificate.description && <ExperienceItemDescription description={certificate.description} />}
                    </div>
                )
            })}
        </>
    )
}

export default Content;
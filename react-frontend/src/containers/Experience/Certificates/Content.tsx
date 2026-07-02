import { SanityExperiencePage } from "../../../Types";
import ExperienceItemDescription from "../ExperienceItemDescription";
import surfaces from "../../../styles/surfaces.module.css";

function Content({ certificates }: Readonly<Pick<SanityExperiencePage['certificatesSection'], 'certificates'>>) {
    return (
        <>
            {certificates.map((certificate, index) => {
                return (
                    <div className={surfaces.stack} key={index}>
                        {certificate.description && <ExperienceItemDescription description={certificate.description} />}
                    </div>
                )
            })}
        </>
    )
}

export default Content;
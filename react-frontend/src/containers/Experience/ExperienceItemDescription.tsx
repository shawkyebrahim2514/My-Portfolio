import { SanityExperiencePage } from '../../Types'
import RichContent from '../../components/RichContent'

type ExperienceItemDescriptionProps = {
    readonly description: SanityExperiencePage['internshipsSection']['internships'][0]['description']
}

export default function ExperienceItemDescription({ description }: ExperienceItemDescriptionProps) {
    return (
        <div>
            <RichContent value={description} />
        </div>
    )
}
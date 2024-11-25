import { SanityExperiencePage } from '../../Types'
import HTMLMarkdown from '../../components/HTMLMarkdown'

type ExperienceItemDescriptionProps = {
    readonly description: SanityExperiencePage['internshipsSection']['internships'][0]['description']
}

export default function ExperienceItemDescription({ description }: ExperienceItemDescriptionProps) {
    return (
        <div>
            <HTMLMarkdown markdown={description} />
        </div>
    )
}
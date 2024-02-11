import { SanitySkillsPage } from '../../../Types'
import Icon from '../../../components/Icon'

export default function SkillsIcons({ skills }: Readonly<Pick<SanitySkillsPage['categories'][number], 'skills'>>) {
    return (
        <>
            {skills.map((skill) => {
                return (
                    <Icon
                        key={skill.name}
                        src={skill.iconURL}
                        text={skill.name} />
                )
            })}
        </>
    )
}

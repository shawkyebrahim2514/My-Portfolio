import Icon from '../../../components/Icon'
import { TechnologySkill } from '../../../Types';

type ListIconsProps = {
    readonly list: TechnologySkill[]
}

export default function listIcons({ list }: ListIconsProps) {
    return (
        <>
            {list.map((icon, index) => {
                return (
                    <Icon
                        key={icon.name}
                        src={icon.iconURL}
                        text={icon.name} />
                )
            })}
        </>
    )
}

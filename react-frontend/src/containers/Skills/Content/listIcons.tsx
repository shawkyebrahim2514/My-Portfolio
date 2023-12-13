import Icon from '../../../components/Icon'
import { TechnologySkill } from '../../../Types';

export default function listIcons({ list }: { list: TechnologySkill[] }) {
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

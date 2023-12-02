import Icon from '../../../components/Icon'

export default function listIcons({ list }) {
    return (
        <>
            {list.map((icon, index) => {
                return (
                    <Icon
                        key={icon.name}
                        src={icon.src}
                        text={icon.name} />
                )
            })}
        </>
    )
}

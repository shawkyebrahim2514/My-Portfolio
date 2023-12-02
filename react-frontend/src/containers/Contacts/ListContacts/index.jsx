import Icon from "../../../components/Icon"

export default function ListContacts({ list }) {
    return (
        <>
            {list.map((project, index) => {
                return (
                    <Icon
                        key={project.alt}
                        src={project.imgSrc}
                        alt={project.alt}
                        text={project.alt}
                        pointer={true}
                        onClick={() => window.open(project.link, "_blank")}
                    />
                )
            })}
        </>
    )
}

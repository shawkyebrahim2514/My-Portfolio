import { CSSProperties, memo, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import { useMediaQuery } from 'react-responsive';
import Image from './Image';
import Content from './Content';

type ProjectCardProps = {
    readonly imgSrc?: string,
    readonly projectLink?: string,
    readonly demoLink?: string,
    readonly title?: string,
    readonly description: string,
    readonly technologies: string[],
}

function ProjectCard({
    imgSrc = "images/placeholder.png",
    projectLink,
    demoLink,
    title,
    description,
    technologies
}: ProjectCardProps) {
    const { theme } = useThemeContext();
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
    const containerStyle = useMemo((): CSSProperties => {
        return {
            alignItems: "stretch",
            justifyContent: "flex-start",
            flexDirection: isSmallScreen ? "column" : "row",
            height: "auto",
            ...theme.container,
        }
    }, [theme, isSmallScreen]);

    return (
        <div style={containerStyle}>
            <Image
                imgSrc={imgSrc || "images/placeholder.png"}
                isSmallScreen={isSmallScreen} />
            <Content 
                description={description} 
                technologies={technologies}
                projectLink={projectLink}
                demoLink={demoLink} />
        </div>
    )
}

export default memo(ProjectCard);
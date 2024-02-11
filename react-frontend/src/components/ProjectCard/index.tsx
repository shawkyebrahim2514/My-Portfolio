import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import { useMediaQuery } from 'react-responsive';
import Image from './Image';
import Content from './Content';

type ProjectCardProps = {
    readonly imgSrc?: string,
    readonly projectLink?: string,
    readonly demoLink?: string,
    readonly title: string,
    readonly description: string,
    readonly technologies: string[],
}

export default function ProjectCard({
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
            padding: "1rem",
            ...theme.bluryStyle.main,
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "stretch",
            justifyContent: "flex-start",
            gap: "1rem",
            height: "auto",
            borderRadius: theme.borderRadius,
            boxShadow: theme.boxShadow,
        }
    }, [theme, isSmallScreen]);

    return (
        <div style={containerStyle}>
            <Image
                imgSrc={imgSrc || "images/placeholder.png"}
                isSmallScreen={isSmallScreen}
                projectLink={projectLink}
                demoLink={demoLink} />
            <Content title={title} description={description} technologies={technologies} />
        </div>
    )
}
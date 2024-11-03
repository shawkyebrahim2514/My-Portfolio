import { CSSProperties, memo, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../Text';
import ListButtons from '../ListButtons';
import ListItems from '../ListItems';
import ProjectButton from './Image/ImageOverlay/ProjectButton';
import DemoButton from './Image/ImageOverlay/DemoButton';

type ContentProps = {
    readonly title: string,
    readonly description: string,
    readonly technologies: string[],
    readonly projectLink?: string,
    readonly demoLink?: string,
}

function Content({ title, description, technologies, projectLink, demoLink }: ContentProps) {
    const outerStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
        }
    }, []);
    const detailsStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: "0.25rem",
        }
    }, []);
    const linksStyle = useMemo(() => ({
        display: "flex",
        gap: "1rem",
    }), []);

    return (
        <div style={outerStyle}>
            <div style={detailsStyle}>
                <Title title={title} />
                <ListItems elements={description.split("\n")} />
            </div>
            <div style={linksStyle}>
                {projectLink && <ProjectButton projectLink={projectLink} />}
                {demoLink && <DemoButton demoLink={demoLink} />}
            </div>
            <ListButtons elements={technologies} />
        </div>
    )
}

function Title({ title }: Readonly<Pick<ContentProps, "title">>) {
    const { theme } = useThemeContext();
    const titleStyle = useMemo((): CSSProperties => {
        return {
            color: theme.colors.base[600],
            backgroundColor: theme.colors.base[200],
            display: "inline-block",
            borderRadius: theme.borderRadius,
            padding: "0 5px",
        }
    }, [theme]);

    return (
        <Text variant={"h3"} style={titleStyle}>{title}</Text>
    )
}

export default memo(Content);
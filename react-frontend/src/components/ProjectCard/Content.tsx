import { CSSProperties, memo, useMemo } from 'react'
import ListButtons from '../ListButtons';
import ProjectButton from './Image/ImageOverlay/ProjectButton';
import DemoButton from './Image/ImageOverlay/DemoButton';
import HTMLMarkdown from '../HTMLMarkdown';

type ContentProps = {
    readonly title?: string,
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
    const linksStyle = useMemo(() => ({
        display: "flex",
        gap: "1rem",
    }), []);

    return (
        <div style={outerStyle}>
            <HTMLMarkdown markdown={description} />
            <div style={linksStyle}>
                {projectLink && <ProjectButton projectLink={projectLink} />}
                {demoLink && <DemoButton demoLink={demoLink} />}
            </div>
            <ListButtons elements={technologies} />
        </div>
    )
}

export default memo(Content);
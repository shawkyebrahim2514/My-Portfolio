/** @jsxImportSource @emotion/react */

import { useMemo, CSSProperties, memo } from 'react'
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { ImageProps } from '..';
import ProjectButton from './ProjectButton';
import DemoButton from './DemoButton';
import BlurBackground from '../../../BlurBackground';

type ImageOverlayProps = {
    readonly isHovered: boolean,
    readonly projectLink?: ImageProps["projectLink"],
    readonly demoLink?: ImageProps["demoLink"],
}

function ImageOverlay({ isHovered, projectLink, demoLink }: ImageOverlayProps) {
    const { theme } = useThemeContext();
    const imageOverlayStyle = useMemo((): CSSProperties => ({
        zIndex: 1,
        position: "absolute",
        top: "0",
        left: "0",
        width: isHovered ? "100%" : "0%",
        height: "100%",
        overflow: "hidden",
        transition: theme.transition,
        border: theme.border,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        borderRadius: theme.borderRadius,
    }), [theme, isHovered]);

    return (
        <div style={imageOverlayStyle}>
            <BlurBackground backgroundColor={theme.colors.dark4} />
            {projectLink && <ProjectButton projectLink={projectLink} />}
            {demoLink && <DemoButton demoLink={demoLink} />}
        </div>
    )
}

export default memo(ImageOverlay);
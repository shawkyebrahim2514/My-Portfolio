import { useMemo, CSSProperties, memo } from 'react'
import { useThemeContext } from '../../../contexts/ThemeContext';
import Button from '../../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeFork, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { ImageProps } from '.';

type ImageOverlayProps = {
    readonly isHovered: boolean,
    readonly projectLink?: ImageProps["projectLink"],
    readonly demoLink?: ImageProps["demoLink"],
}

function ImageOverlay({ isHovered, projectLink, demoLink }: ImageOverlayProps) {
    const { theme } = useThemeContext();
    const imageOverlayStyle = useMemo((): CSSProperties => {
        return {
            position: "absolute",
            top: "0",
            left: "0",
            width: isHovered ? "100%" : "0%",
            height: "100%",
            overflow: "hidden",
            transition: theme.transition,
            ...theme.bluryStyle.main,
            backgroundColor: theme.colors.dark.faded,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            borderRadius: theme.borderRadius,
        }
    }, [theme, isHovered]);

    return (
        <div style={imageOverlayStyle}>
            {projectLink && <ProjectButton projectLink={projectLink} />}
            {demoLink && <DemoButton demoLink={demoLink} />}
        </div>
    )
}

const ProjectButton = memo(({ projectLink }: Readonly<Pick<ImageOverlayProps, "projectLink">>) => {
    return (
        <Button
            icon={<FontAwesomeIcon icon={faCodeFork} />}
            text={"Project"}
            onClick={() => { window.open(projectLink, "_blank") }}
            pointer={true}
        />
    )
})

const DemoButton = memo(({ demoLink }: Readonly<Pick<ImageOverlayProps, "demoLink">>) => {
    return (
        <Button
            icon={<FontAwesomeIcon icon={faDesktop} />}
            text={"Demo"}
            onClick={() => { window.open(demoLink, "_blank") }}
            pointer={true}
        />
    )
})

export default memo(ImageOverlay);
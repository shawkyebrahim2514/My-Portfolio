import { useState, useMemo, CSSProperties } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeFork, faDesktop } from '@fortawesome/free-solid-svg-icons';

type ImageProps = {
    readonly imgSrc: string,
    readonly isSmallScreen: boolean,
    readonly projectLink?: string,
    readonly demoLink?: string,
}

export default function Image({ imgSrc, isSmallScreen, projectLink, demoLink }: ImageProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { theme } = useThemeContext();
    const imageFrameStyle = useMemo((): CSSProperties => {
        return {
            maxWidth: isSmallScreen ? "100%" : "350px",
            height: isSmallScreen ? "250px" : "auto",
            overflow: "hidden",
            borderRadius: theme.borderRadius,
            border: `1px solid ${theme.colors.main.full}`,
            boxShadow: theme.boxShadow,
            position: "relative",
            flex: "0 0 auto"
        }
    }, [theme, isSmallScreen]);

    return (
        <div
            onMouseOver={() => { setIsHovered(true) }}
            onFocus={() => { setIsHovered(true) }}
            onMouseOut={() => { setIsHovered(false) }}
            onBlur={() => { setIsHovered(false) }}
            style={imageFrameStyle} >
            <MainImage imgSrc={imgSrc} />
            <ImageOverlay isHovered={isHovered} links={{ projectLink, demoLink }} />
        </div>
    )
}

function MainImage({ imgSrc }: Readonly<Pick<ImageProps, "imgSrc">>) {
    return (
        <img
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src={imgSrc}
            alt={imgSrc} />
    )
}

function ImageOverlay({ isHovered, links }:
    { readonly isHovered: boolean, readonly links: Pick<ImageProps, "projectLink" | "demoLink"> }
) {
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
            {links.projectLink && <ProjectButton projectLink={links.projectLink} />}
            {links.demoLink && <DemoButton demoLink={links.demoLink} />}
        </div>
    )
}

function ProjectButton({ projectLink }: Readonly<Pick<ImageProps, "projectLink">>) {
    return (
        <Button
            icon={<FontAwesomeIcon icon={faCodeFork} />}
            text={"Project"}
            onClick={() => { window.open(projectLink, "_blank") }}
            pointer={true}
        />
    )
}

function DemoButton({ demoLink }: Readonly<Pick<ImageProps, "demoLink">>) {
    return (
        <Button
            icon={<FontAwesomeIcon icon={faDesktop} />}
            text={"Demo"}
            onClick={() => { window.open(demoLink, "_blank") }}
            pointer={true}
        />
    )
}
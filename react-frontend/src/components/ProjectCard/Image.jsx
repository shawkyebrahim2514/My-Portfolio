import { useState, useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeFork, faDesktop } from '@fortawesome/free-solid-svg-icons';


export default function Image({ imgSrc, isSmallScreen, projectLink, demoLink }) {
    const [isHovered, setIsHovered] = useState(false);
    const theme = useContext(Context);
    const imageFrameStyle = useMemo(() => {
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
    const imageOverlayStyle = useMemo(() => {
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
        <div
            onMouseOver={() => { setIsHovered(true) }}
            onMouseOut={() => { setIsHovered(false) }}
            style={imageFrameStyle}
        >
            <img
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={imgSrc}
                alt={imgSrc} />

            <div style={imageOverlayStyle}>
                {projectLink && (
                    <Button
                        icon={<FontAwesomeIcon icon={faCodeFork} />}
                        text={"Project"}
                        onClick={() => { window.open(projectLink, "_blank") }}
                        pointer={true}
                    />
                )}
                {demoLink && (
                    <Button
                        icon={<FontAwesomeIcon icon={faDesktop} />}
                        text={"Demo"}
                        onClick={() => { window.open(demoLink, "_blank") }}
                        pointer={true}
                    />
                )}
            </div>
        </div>
    )
}

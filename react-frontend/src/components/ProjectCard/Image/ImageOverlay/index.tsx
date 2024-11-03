/** @jsxImportSource @emotion/react */

import { useMemo, CSSProperties, memo } from 'react'
import { useThemeContext } from '../../../../contexts/ThemeContext';
import BlurBackground from '../../../BlurBackground';

type ImageOverlayProps = {
    readonly isHovered: boolean,
}

function ImageOverlay({ isHovered }: ImageOverlayProps) {
    const { theme } = useThemeContext();
    const imageOverlayStyle = useMemo((): CSSProperties => ({
        zIndex: 1,
        position: "absolute",
        top: isHovered ? 0 : "50%",
        left: isHovered ? 0 : "50%",
        width: isHovered ? "100%" : "0%",
        height: isHovered ? "100%" : "0%",
        overflow: "hidden",
        transition: theme.transition,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        borderRadius: theme.borderRadius,
    }), [theme, isHovered]);

    return (
        <div style={imageOverlayStyle}>
            <BlurBackground backgroundColor={theme.colors.base[700]} />
        </div>
    )
}

export default memo(ImageOverlay);
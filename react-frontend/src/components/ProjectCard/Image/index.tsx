import { useState, useMemo, CSSProperties } from 'react'
import { useThemeContext } from '../../../contexts/ThemeContext';
// import ImageOverlay from './ImageOverlay';
import MainImage from './MainImage';

export type ImageProps = {
    readonly imgSrc: string,
    readonly isSmallScreen: boolean,
}

export default function Image({ imgSrc, isSmallScreen }: ImageProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { theme } = useThemeContext();
    const imageFrameStyle = useMemo((): CSSProperties => {
        return {
            maxWidth: isSmallScreen ? "100%" : "350px",
            height: isSmallScreen ? "250px" : "auto",
            overflow: "hidden",
            borderRadius: theme.borderRadius,
            border: `1px solid ${theme.colors.base}`,
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
            <MainImage imgSrc={imgSrc} isHovered={isHovered} />
            {/* <ImageOverlay isHovered={isHovered} /> */}
        </div>
    )
}
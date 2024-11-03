import { memo } from "react"
import { useThemeContext } from '../../../contexts/ThemeContext';

function MainImage({ imgSrc, isHovered }: { imgSrc: string, isHovered: boolean }) {
    const { theme } = useThemeContext();

    return (
        <img
            style={{ 
                transition: theme.transition ,
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                scale: isHovered ? "1.2" : "1"
            }}
            src={imgSrc}
            alt={imgSrc} />
    )
}

export default memo(MainImage);
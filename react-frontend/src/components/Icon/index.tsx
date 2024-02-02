import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../Text';
import { motion } from "framer-motion"

const variants = {
    "lg": {
        outerPadding: "0.5rem 1rem",
        imageWidth: "70px",
        imageHeight: "70px",
        fontSize: "1rem",
    },
    "md": {
        outerPadding: "0.4rem 0.9rem",
        imageWidth: "50px",
        imageHeight: "50px",
        fontSize: "0.8rem",
    },
}

type IconProps = {
    readonly src?: string;
    readonly alt?: string;
    readonly text?: string;
    readonly pointer?: boolean;
    readonly onClick?: () => void;
    readonly size?: keyof typeof variants;
}

const motionProperties = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
}

export default function Icon({
    src = "images/placeholder.png",
    alt,
    text,
    pointer = false,
    onClick,
    size = "md"
}: IconProps) {
    const { theme } = useThemeContext();
    const outerStyle = useMemo((): CSSProperties => {
        return {
            display: "inline-flex",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: theme.colors.main.full,
            borderRadius: "8px",
            padding: variants[size].outerPadding,
            transition: theme.transition,
            boxShadow: theme.boxShadow,
            ...theme.bluryStyle.main,
            cursor: pointer ? "pointer" : "default",
            fontSize: variants[size].fontSize,
        };
    }, [theme, pointer, size]);
    const imageFrameStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: variants[size].imageWidth,
            height: variants[size].imageHeight,
            borderRadius: "50%",
            ...theme.bluryStyle.main,
            overflow: "hidden",
        };
    }, [theme, size]);
    const imageStyle = useMemo((): CSSProperties => {
        return {
            width: "70%",
            objectFit: "cover",
            filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.5))",
        };
    }, []);

    return (
        <motion.div
            style={outerStyle}
            whileHover={motionProperties.whileHover}
            whileTap={motionProperties.whileTap}
            onClick={onClick} >
            <div style={imageFrameStyle}>
                <img style={imageStyle} src={src} alt={alt} />
            </div>
            {text && <Text variant={"body"}>{text}</Text>}
        </motion.div>
    )
}

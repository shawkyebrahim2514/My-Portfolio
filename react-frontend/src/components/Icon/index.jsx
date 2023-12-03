import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';
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

export default function Icon({ src = "images/placeholder.png", alt, text, pointer = false, onClick, size = "md" }) {
    const theme = useContext(Context);
    const outerStyle = useMemo(() => {
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
        }
    }, [theme]);
    const imageFrameStyle = useMemo(() => {
        return {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: variants[size].imageWidth,
            height: variants[size].imageHeight,
            borderRadius: "50%",
            ...theme.bluryStyle.main,
            overflow: "hidden",
        }
    }, [theme]);

    return (
        <motion.div
            style={outerStyle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
        >
            <div style={imageFrameStyle}>
                <img style={{
                    width: "70%",
                    objectFit: "cover",
                    filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.5))",
                }} src={src} alt={alt} />
            </div>
            {text && <Text variant={"body"}>{text}</Text>}
        </motion.div>
    )
}

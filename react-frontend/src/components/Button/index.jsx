import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';
import { motion } from "framer-motion";

const differentSizes = {
    sm: {
        fontSize: "0.8rem",
        padding: "0.25rem 0.5rem",
    },
    md: {
        fontSize: "1rem",
        padding: "0.35rem 0.6rem",
    },
    lg: {
        fontSize: "1rem",
        padding: "0.5rem 1rem",
    }
}

export default function Button({ icon, text, onClick, size = "lg", style, pointer }) {
    const theme = useContext(Context);
    const buttonStyle = useMemo(() => {
        return {
            display: "inline-flex",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "center",
            color: theme.colors.main.full,
            borderRadius: "8px",
            padding: differentSizes[size].padding,
            fontSize: differentSizes[size].fontSize,
            cursor: pointer ? "pointer" : "default",
            transition: theme.transition,
            boxShadow: theme.boxShadow,
            ...theme.bluryStyle.main,
            ...style,
        }
    }, [theme, size, style]);

    return (
        <motion.div
            style={buttonStyle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
        >
            {icon}
            {text}
        </motion.div>
    )
}

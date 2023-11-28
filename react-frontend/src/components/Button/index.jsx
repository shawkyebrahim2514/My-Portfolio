import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';

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
            padding: (size == "lg") ? "0.5rem 1rem" : "0.25rem 0.5rem",
            fontSize: (size == "lg") ? "1rem" : "0.9rem",
            cursor: pointer ? "pointer" : "default",
            transition: theme.transition,
            boxShadow: theme.boxShadow,
            ...theme.bluryStyle.main,
            ...style,
        }
    }, [theme, size, style]);
    
    return (
        <div
            style={buttonStyle}
            onClick={onClick}
        >
            {icon}
            {text}
        </div>
    )
}

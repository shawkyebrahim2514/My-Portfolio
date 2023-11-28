import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Text from '../Text';

export default function Icon({ src = "images/placeholder.png", alt, text, pointer = false, onClick }) {
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
            padding: "0.5rem 1rem",
            transition: theme.transition,
            boxShadow: theme.boxShadow,
            ...theme.bluryStyle.main,
            cursor: pointer ? "pointer" : "default",
        }
    }, [theme]);
    const imageFrameStyle = useMemo(() => {
        return {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            ...theme.bluryStyle.main,
            overflow: "hidden",
        }
    }, [theme]);

    return (
        <div
            onClick={onClick}
            style={outerStyle}>
            <div style={imageFrameStyle}>
                <img style={{
                    width: "70%",
                    objectFit: "cover",
                    filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.5))",
                }} src={src} alt={alt} />
            </div>
            {text && <Text variant={"h4"}>{text}</Text>}
        </ div>
    )
}

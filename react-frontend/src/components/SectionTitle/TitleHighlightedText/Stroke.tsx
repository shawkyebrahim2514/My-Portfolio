import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../../contexts/ThemeContext'

function Stroke() {
    const { theme } = useThemeContext();
    const style = useMemo((): CSSProperties => ({
        width: "calc(100% - 10px)",
        height: "calc(100% - 10px)",
        position: "absolute",
        zIndex: "1",
        border: `3px solid ${theme.colors.base[800]}`,
        top: "5px",
        left: "5px",
        margin: "auto",
        borderRadius: "inherit", 
    }), [theme.colors]);
    
    return (
        <div style={style} />
    );
}

export default Stroke;
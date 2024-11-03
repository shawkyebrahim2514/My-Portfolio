import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../../contexts/ThemeContext'

function Stroke({ titleWidth }: { readonly titleWidth: number }) {
    const { theme } = useThemeContext();
    const style = useMemo((): CSSProperties => ({
        width: titleWidth - 10,
        height: "50px",
        position: "absolute",
        zIndex: "1",
        border: `3px solid ${theme.colors.base[800]}`,
        top: "5px",
        left: "5px",
        margin: "auto",
        borderRadius: "inherit", 
    }), [theme.colors, titleWidth]);
    
    return (
        <div style={style} />
    );
}

export default Stroke;
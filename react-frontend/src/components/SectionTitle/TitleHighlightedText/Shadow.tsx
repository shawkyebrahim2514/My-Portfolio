import { CSSProperties, useMemo } from 'react';
import { useThemeContext } from '../../../contexts/ThemeContext';

function Shadow() {
    const { theme } = useThemeContext();

    const style = useMemo((): CSSProperties => ({
        width: "inherit",
        height: "inherit",
        position: "absolute",
        zIndex: "-2",
        backgroundColor: theme.colors.base[800],
        bottom: "-3px",
        left: "3px",
        margin: "auto",
        borderRadius: "inherit", 
    }), []);
    
    return (
        <div style={style} />
    );
}

export default Shadow;
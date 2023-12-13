import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';

export default function HeaderSymbol() {
    const { theme } = useThemeContext();
    const outerStyle = useMemo(() : CSSProperties => ({
        width: "20px",
        height: "20px",
        ...theme.bluryStyle.main,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }), [theme]);
    const innerStyle = useMemo(() : CSSProperties => ({
        width: "70%",
        height: "70%",
        borderRadius: "50%",
        backgroundColor: theme.colors.main.full,
    }), [theme]);

    return (
        <div style={outerStyle}>
            <div style={innerStyle} />
        </div>
    )
}

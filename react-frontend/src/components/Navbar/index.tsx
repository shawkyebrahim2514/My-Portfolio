import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Logo from './Logo'
import Links from './Links';

export default function Navbar() {
    const { theme } = useThemeContext();
    const outerStyle = useMemo(() : CSSProperties => ({
        position: "fixed",
        padding: "1rem",
        width: "100%",
        top: "0",
        left: "0",
        zIndex: "999",
        boxShadow: theme.boxShadow,
        ...theme.bluryStyle.main,
        border: "none"
    }), [theme]);
    const innerStyle = useMemo(() : CSSProperties => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: "100%",
        maxWidth: "1255px",
        margin: "0 auto",
        padding: "0 1rem",
        flexWrap: "wrap",
    }), []);

    return (
        <div style={outerStyle}>
            <div style={innerStyle}>
                <Logo />
                <Links />
            </div>
        </div>
    )
}

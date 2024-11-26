import { CSSProperties, useEffect, useMemo, useState } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Logo from './Logo'
import Links from './Links';
import { SanityNavbarData } from '../../Types';
import { getNavbarData } from '../../APIs';
import Loader from '../Loader';

export default function Navbar() {
    const [navbarData, setNavbarData] = useState<SanityNavbarData | null>(null);
    const { theme } = useThemeContext();
    const outerStyle = useMemo((): CSSProperties => ({
        position: "sticky",
        padding: "1rem",
        maxWidth: "1255px",
        top: "20px",
        zIndex: "999",
        backgroundColor: theme.colors.base[900],
        ...theme.boxingStyle,
        border: "none",
    }), [theme]);
    const innerStyle = useMemo((): CSSProperties => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: "100%",
        maxWidth: "1255px",
        margin: "0 auto",
        padding: "0 1rem",
        flexWrap: "wrap",
    }), []);

    useEffect(() => {
        getNavbarData().then((data) => {
            setNavbarData(data);
        });
    }, []);

    return (
        <div style={outerStyle}>
            <div style={innerStyle}>
                {navbarData ? <Logo logo={navbarData.logo} /> : <Loader />}
                <Links />
            </div>
        </div>
    )
}

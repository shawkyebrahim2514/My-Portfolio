import { useContext } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Logo from './Logo'
import Links from './Links';

export default function Navbar({ links, setLinks }) {
    const theme = useContext(Context);

    return (
        <div style={{
            position: "fixed",
            padding: "1rem",
            width: "100%",
            top: "0",
            left: "0",
            zIndex: "999",
            boxShadow: theme.boxShadow,
            ...theme.bluryStyle.main,
            border: "none"
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: "100%",
                maxWidth: "1255px",
                margin: "0 auto",
                padding: "0 1rem",
                flexWrap: "wrap",
            }}>
                <Logo />
                <Links links={links} setLinks={setLinks} />
            </div>
        </div>
    )
}

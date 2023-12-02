import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';

export default function Content({ children }) {
    const theme = useContext(Context);
    const mainStyle = useMemo(() => {
        return {
            display: "flex",
            justifyContent: "flex-start",
            gap: "1rem",
            alignItems: "stretch",
            paddingLeft: "10px",
        }
    }, []);
    const verticalLineStyle = useMemo(() => {
        return {
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: theme.colors.main.full,
        }
    }, [theme]);

    return (
        <main style={mainStyle}>
            <div style={verticalLineStyle} />
            <div style={{
                flexGrow: 1,
            }}>
                {children}
            </div>
        </main>
    )
}

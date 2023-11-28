import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Text from '../Text'

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
            width: "2px",
            minHeight: "100%",
            backgroundColor: theme.colors.main.full,
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

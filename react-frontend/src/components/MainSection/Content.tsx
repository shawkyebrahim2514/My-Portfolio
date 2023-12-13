import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';

type ContentProps = {
    readonly children: React.ReactNode,
}

export default function Content({ children }: ContentProps) {
    const { theme } = useThemeContext();
    const mainStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            justifyContent: "flex-start",
            gap: "1rem",
            alignItems: "stretch",
            paddingLeft: "10px",
        }
    }, []);
    const verticalLineStyle = useMemo((): CSSProperties => {
        return {
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: theme.colors.main.full,
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

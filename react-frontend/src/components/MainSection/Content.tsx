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
            border: theme.border,
            backgroundColor: theme.colors.base,
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

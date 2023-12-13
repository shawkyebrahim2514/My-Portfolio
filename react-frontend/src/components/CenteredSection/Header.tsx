import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../Text'

type HeaderProps = {
    readonly title: string,
    readonly subtitle?: string,
    readonly icon: JSX.Element,
}

export default function Header({ title, subtitle, icon }: HeaderProps) {
    const { theme } = useThemeContext();
    const headerStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
        }
    }, []);
    const hrStyle = useMemo((): CSSProperties => {
        return {
            width: "100%",
            height: "1px",
            backgroundColor: theme.colors.main.full,
            border: "none",
        }
    }, [theme]);

    return (
        <header style={headerStyle}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                color: theme.colors.main.full,
            }}>
                {icon}
                <Text variant={"h3"}>
                    {title}
                </Text>
            </div>
            {subtitle &&
                <Text variant={"h3"}>{subtitle}</Text>}
            <hr style={hrStyle} />
        </header>
    )
}

import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../Text'

type HeaderProps = {
    readonly title: string,
    readonly subtitle?: string,
    readonly icon: JSX.Element,
}

export default function Header({ title, subtitle, icon }: HeaderProps) {
    const headerStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
        }
    }, []);

    return (
        <header style={headerStyle}>
            <HeaderTitle title={title} icon={icon} />
            {subtitle && <Text variant={"h3"}>{subtitle}</Text>}
            <HorizontalLine />
        </header>
    )
}

function HeaderTitle({ title, icon }: Readonly<Pick<HeaderProps, "title" | "icon">>) {
    const { theme } = useThemeContext();
    const titleStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            color: theme.colors.base[700],
        }
    }, [theme.colors]);

    return (
        <div style={titleStyle}>
            {icon}
            <Text variant={"h3"}>
                {title}
            </Text>
        </div>
    )
}

function HorizontalLine() {
    const { theme } = useThemeContext();
    const hrStyle = useMemo((): CSSProperties => {
        return {
            width: "100%",
            height: "1px",
            backgroundColor: theme.colors.base[200],
            border: "none",
        }
    }, [theme.colors]);

    return (
        <hr style={hrStyle} />
    )
}
import Text from '../Text'
import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext'

type SectionTitleProps = {
    readonly highlightedText?: string;
    readonly text?: string;
    readonly subtitle?: string;
    readonly style?: React.CSSProperties;
}

export default function SectionTitle({ highlightedText, text, subtitle, style }: SectionTitleProps) {
    const containerStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            ...style,
            textAlign: "center",
        };
    }, [style]);
    const titleStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "1.2rem",
            flexWrap: "wrap",
        };
    }, []);

    return (
        <header style={containerStyle}>
            <div style={titleStyle}>
                {highlightedText ? <TitleHighlightedText>{highlightedText}</TitleHighlightedText> : null}
                {text ? <Text variant={"h2"}>{text}</Text> : null}
            </div>
            {subtitle ? <Text variant={"h3"}>{subtitle}</Text> : null}
        </header>
    )
}

function TitleHighlightedText({ children }: { readonly children: string }) {
    const { theme } = useThemeContext();
    const style = useMemo((): CSSProperties => {
        return {
            backgroundColor: theme.colors.main.full,
            padding: "0.25rem 0.5rem",
            color: theme.colors.dark.full,
            boxShadow: theme.boxShadow,
        };
    }, [theme]);

    return <Text variant={"h2"} style={style}>{children}</Text>
}
import Text from '../Text'
import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext'

export default function SectionTitle({ highlightedText, text, subtitle, style }) {
    const theme = useContext(Context);
    const containerStyle = useMemo(() => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            ...style,
            textAlign: "center",
        }
    }, [theme]);
    const titleStyle = useMemo(() => {
        return {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "1.2rem",
            flexWrap: "wrap",
        }
    }, [theme]);
    const highlightedTextStyle = useMemo(() => {
        return {
            backgroundColor: theme.colors.main.full,
            padding: "0.25rem 0.5rem",
            color: theme.colors.dark.full,
            boxShadow: theme.boxShadow,
        }
    }, [theme]);

    return (
        <header style={containerStyle}>
            <div style={titleStyle}>
                {highlightedText ?
                    <Text
                        variant={"h2"}
                        style={highlightedTextStyle}>
                        {highlightedText}
                    </Text>
                    : null}
                {text ? <Text variant={"h2"}>{text}</Text> : null}
            </div>
            {subtitle ? <Text variant={"h3"}>{subtitle}</Text> : null}
        </header>
    )
}

import Text from '../Text'
import { CSSProperties, useMemo } from 'react'
import TitleHighlightedText from './TitleHighlightedText';

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
            gap: "1rem",
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
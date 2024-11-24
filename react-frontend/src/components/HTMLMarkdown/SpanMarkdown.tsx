import { CSSProperties, useMemo } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import type { Element, Text } from 'hast'
import { visit } from 'unist-util-visit';
import { v4 as uuidv4 } from 'uuid';

type SpanElementType = "highlight-area" | "highlight-text";
type SpanColorType = "base" | "secondary";
type TargetElementType = Record<SpanElementType, Record<SpanColorType, (oldStyle: CSSProperties, children: React.ReactNode) => { style: CSSProperties, children: React.ReactNode }>>;

type SpanMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLSpanElement>;

const SpanMarkdown = ({ node, ...props }: SpanMarkdownProps) => {
    const { theme } = useThemeContext();
    let className = useMemo(() => props?.className?.split(' ') || [], [props?.className]);
    let spanText = useMemo(() => {
        let text = '';
        visit(node as Element, 'text', (textNode: Text) => {
            text = textNode.value;
            const matchHighlightAreaWithSecondaryColor = text.match(/^!-(.*?)-!/g);
            const matchHighlightAreaWithBaseColor = text.match(/^-(.*?)-/g);
            const matchHighlightTextWithSecondaryColor = text.match(/^!(.*?)!/g);
            if (matchHighlightAreaWithSecondaryColor) {
                className.push("highlight-area");
                className.push("secondary");
                text = text.substring(2, matchHighlightAreaWithSecondaryColor[0].length - 2);
            } else if (matchHighlightAreaWithBaseColor) {
                className.push("highlight-area");
                text = text.substring(1, matchHighlightAreaWithBaseColor[0].length - 1);
            } else if (matchHighlightTextWithSecondaryColor) {
                className.push("secondary");
                text = text.substring(1, matchHighlightTextWithSecondaryColor[0].length - 1);
            }
        });
        return text;
    }, [node, className]);

    const textStyle = useMemo((): CSSProperties => {
        return {
            position: "relative",
            display: "inline-block",
        }
    }, []);
    const lightEffectStyle = useMemo((): CSSProperties => ({
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.secondary[300],
        height: "40%",
        zIndex: -1,
    }), [theme.colors.secondary]);
    const targetElement = useMemo((): TargetElementType => ({
        "highlight-area": {
            "base": (oldStyle: CSSProperties, children: React.ReactNode) => {
                const spanStyle = {
                    ...oldStyle,
                    ...textStyle,
                    fontWeight: 600,
                }
                const barStyle = {
                    ...lightEffectStyle,
                    backgroundColor: theme.colors.base[300],
                }
                return {
                    style: spanStyle,
                    children: [
                        <div key={uuidv4()} style={barStyle} />,
                        children
                    ]
                }
            },
            "secondary": (oldStyle: CSSProperties, children: React.ReactNode) => {
                const spanStyle = {
                    ...oldStyle,
                    ...textStyle,
                    fontWeight: 600,
                }
                const barStyle = {
                    ...lightEffectStyle,
                    backgroundColor: theme.colors.secondary[300],
                }
                return {
                    style: spanStyle,
                    children: [
                        <div key={uuidv4()} style={barStyle} />,
                        children
                    ]
                }
            },
        },
        "highlight-text": {
            "base": (oldStyle: CSSProperties, children: React.ReactNode) => {
                const spanStyle = {
                    ...oldStyle,
                    ...textStyle,
                    fontWeight: 700,
                }
                return {
                    style: spanStyle,
                    children: children
                }
            },
            "secondary": (oldStyle: CSSProperties, children: React.ReactNode) => {
                const spanStyle = {
                    ...oldStyle,
                    ...textStyle,
                    color: theme.colors.secondary[500],
                    fontWeight: 700,
                }
                return {
                    style: spanStyle,
                    children: children
                }
            },
        },
    }), [lightEffectStyle, textStyle, theme.colors.base, theme.colors.secondary]);
    const spanElement = useMemo((): SpanElementType => {
        return className?.includes("highlight-area") ? "highlight-area" : "highlight-text";
    }, [className]);
    const colorType = useMemo((): SpanColorType => {
        return className?.includes("secondary") ? "secondary" : "base";
    }, [className]);
    const { style, children } = useMemo((): { style: CSSProperties, children: React.ReactNode } => {
        return targetElement[spanElement][colorType](props.style ?? {}, spanText);
    }, [colorType, spanText, props.style, spanElement, targetElement]);

    return (
        <span {...props} style={style}>
            {children}
        </span>
    );
}

export default SpanMarkdown
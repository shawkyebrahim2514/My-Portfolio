import { CSSProperties, useMemo } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import type { Element, RootContent } from 'hast'
import { v4 as uuidv4 } from 'uuid';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { markdownComponents } from '.';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import Button from '../Button';

type SpanElementType = "highlight-area" | "highlight-text";
type SpanColorType = "base" | "secondary";
type TargetElementType = Record<SpanElementType, Record<SpanColorType, (oldStyle: CSSProperties, children: React.ReactNode) => { style: CSSProperties, children: React.ReactNode }>>;

type SpanMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLSpanElement>;

const SpanMarkdown = ({ node, className, ...props }: SpanMarkdownProps) => {
    const { theme } = useThemeContext();
    let classes = (() => className?.split(' ') || [])();
    let content = node?.children;

    const contentJSXElementsFromAST = useMemo(() => (
        typeof content === 'string' ? content :
            node?.children.map((element) => toJsxRuntime(element as RootContent, {
                Fragment, jsx, jsxs, passNode: true, components: {
                    ...markdownComponents,
                    br: () => null,
                }
            }))
    ), [content, node?.children]);

    const textStyle = useMemo((): CSSProperties => {
        return {
            position: "relative",
            display: "inline-block",
            zIndex: 2,
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
                    color: theme.colors.base[800],
                }
                const barStyle = {
                    ...lightEffectStyle,
                    backgroundColor: theme.colors.base[200],
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
                    color: theme.colors.base[800],
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
                    fontWeight: 600,
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
                    fontWeight: 600,
                }
                return {
                    style: spanStyle,
                    children: children
                }
            },
        },
    }), [lightEffectStyle, textStyle, theme.colors.base, theme.colors.secondary]);
    const spanElement = useMemo((): SpanElementType => {
        return classes.includes("highlight-area") ? "highlight-area" : "highlight-text";
    }, [classes]);
    const colorType = useMemo((): SpanColorType => {
        return classes.includes("secondary") ? "secondary" : "base";
    }, [classes]);
    const { style, children } = useMemo((): { style: CSSProperties, children: React.ReactNode } => {
        return targetElement[spanElement][colorType](props.style ?? {}, contentJSXElementsFromAST);
    }, [colorType, contentJSXElementsFromAST, props.style, spanElement, targetElement]);

    // `**[[Button]]**`
    if(classes.includes("button")) {
        return <Button key={classes.join()} size='sm'>{contentJSXElementsFromAST}</Button>
    }

    return (
        <span {...props} style={style}>
            {children}
        </span>
    );
}

export default SpanMarkdown
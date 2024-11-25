import { CSSProperties, useMemo } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import type { Element, Text, Node, RootContent } from 'hast'
import { visit } from 'unist-util-visit';
import { v4 as uuidv4 } from 'uuid';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { markdownComponents } from '.';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'

type SpanElementType = "highlight-area" | "highlight-text";
type SpanColorType = "base" | "secondary";
type TargetElementType = Record<SpanElementType, Record<SpanColorType, (oldStyle: CSSProperties, children: React.ReactNode) => { style: CSSProperties, children: React.ReactNode }>>;

type SpanMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLSpanElement>;

const isTextNode = (node: Node): node is Text => {
    return node?.type === 'text';
};

const SpanMarkdown = ({ node, ...props }: SpanMarkdownProps) => {
    const { theme } = useThemeContext();
    let className = (() => props?.className?.split(' ') || [])();
    let content = (() => {
        let currentNodes: Node[] = node?.children || [];
        // No children element found, only a text node
        if (currentNodes.length === 1 && isTextNode(currentNodes[0])) {
            let text = currentNodes[0].value;
            visit(node as Element, 'text', (textNode: Text) => {
                text = textNode.value;
                // console.log("text: ", text);
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
        }
        let firstNodeChild = currentNodes[0];
        let lastNodeChild = currentNodes[currentNodes.length - 1];
        if (isTextNode(firstNodeChild) && isTextNode(lastNodeChild) &&
            firstNodeChild.value === lastNodeChild.value.split('').reverse().join('')) {
            let text = firstNodeChild.value;
            const matchHighlightAreaWithSecondaryColor = /^!-/.exec(text);
            const matchHighlightAreaWithBaseColor = /^-/.exec(text);
            const matchHighlightTextWithSecondaryColor = /^!/.exec(text);
            if (matchHighlightAreaWithSecondaryColor) {
                className.push("highlight-area");
                className.push("secondary");
            } else if (matchHighlightAreaWithBaseColor) {
                className.push("highlight-area");
            } else if (matchHighlightTextWithSecondaryColor) {
                className.push("secondary");
            }
            console.log("text: ", text);
            console.log("className: ", className);
            console.log("matchHighlightAreaWithSecondaryColor: ", matchHighlightAreaWithSecondaryColor);
            console.log("matchHighlightAreaWithBaseColor: ", matchHighlightAreaWithBaseColor);
            console.log("matchHighlightTextWithSecondaryColor: ", matchHighlightTextWithSecondaryColor);

            // Delete the first and last node
            currentNodes.shift();
            currentNodes.pop();
        }
        return currentNodes;
    })();

    const contentJSXElementsFromAST = useMemo(() => (
        typeof content === 'string' ? content :
            content.map((element) => toJsxRuntime(element as RootContent, {
                Fragment, jsx, jsxs, passNode: true, components: {
                    ...markdownComponents,
                    br: () => null,
                }
            }))
    ), [content]);

    // console.log("Content: ", content);

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
        return targetElement[spanElement][colorType](props.style ?? {}, contentJSXElementsFromAST);
    }, [colorType, contentJSXElementsFromAST, props.style, spanElement, targetElement]);

    return (
        <span {...props} style={style}>
            {children}
        </span>
    );
}

export default SpanMarkdown
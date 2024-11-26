import { useMemo } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import type { Element, Node, Text, Parent, RootContent } from 'hast'
import MainSection from '../MainSection';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { markdownComponents } from '.';

type BlockquoteElementType = "highlight-background" | "without-background";
type BlockquoteColorType = "base" | "secondary";
type TargetElementType = Record<BlockquoteElementType, Record<BlockquoteColorType, {
    containerBackgroundColor: string,
    barColor: string,
}>>
type BlockquoteMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLQuoteElement>;

const isTextNode = (node: Node): node is Text => {
    return node?.type === 'text';
};

const isParentNode = (node: Node): node is Parent => {
    return node && 'children' in node;
};

const dfsVisit = (currentNode: Node, callback: (node: Node) => boolean | undefined): boolean => {
    let isFinished = false;
    if (isParentNode(currentNode)) {
        for (const child of currentNode.children) {
            isFinished = callback(child) || isFinished;
            if (!isFinished) {
                isFinished = dfsVisit(child, callback) || isFinished;
            }
        }
    }
    return isFinished;
};

const BlockquoteMarkdown = ({ node, ...props }: BlockquoteMarkdownProps) => {
    const { theme } = useThemeContext();

    let { className, title, content } = useMemo(() => {
        let className = props?.className?.split(' ') || [];
        let title = '';
        let content: Node[] = node?.children || [];
        let completed = false;
        dfsVisit(node as Node, (currentNode: Node) => {
            if (completed) {
                content.push(currentNode);
            } else if (isTextNode(currentNode)) {
                if (currentNode.value) {
                    const match = /\[!(.+)\](.*)/.exec(currentNode.value);
                    if (match) {
                        match[1].trim().split(' ').forEach((element) => {
                            className.push(element);
                        });
                        title = match[2].trim();
                        content = [];
                        completed = true;
                        return true;
                    }
                }
            }
            return false;
        });
        return { className, title, content };
    }, [node, props.className]);

    const contentJSXElementsFromAST = useMemo(() => (
        content.map((element) => toJsxRuntime(element as RootContent, {
            Fragment, jsx, jsxs, passNode: true, components: {
                ...markdownComponents,
                br: () => null,
            }
        }))
    ), [content]);

    const targetElement = useMemo((): TargetElementType => ({
        "highlight-background": {
            "base": {
                containerBackgroundColor: theme.colors.base[200],
                barColor: theme.colors.base[700],
            },
            "secondary": {
                containerBackgroundColor: theme.colors.secondary[200],
                barColor: theme.colors.secondary[500],
            },
        },
        "without-background": {
            "base": {
                containerBackgroundColor: "transparent",
                barColor: theme.colors.base[700],
            },
            "secondary": {
                containerBackgroundColor: "transparent",
                barColor: theme.colors.secondary[500],
            },
        },
    }), [theme.colors.base, theme.colors.secondary]);

    // By default it will be without-background and base color
    let backgroundType = useMemo((): BlockquoteElementType => className?.includes("highlight") ? "highlight-background" : "without-background", [className]);
    let colorType = useMemo((): BlockquoteColorType => className?.includes("secondary") ? "secondary" : "base", [className]);
    let colors = useMemo(() => targetElement[backgroundType][colorType], [backgroundType, colorType, targetElement]);

    if (className.includes("popup")) {
        return (
            <MainSection
                title={title}>
                {contentJSXElementsFromAST}
            </MainSection>
        );
    }

    return (<div
        {...props as React.HTMLAttributes<HTMLDivElement>}
        className='blockquote'
        style={{
            ...props.style,
            padding: "1rem",
            position: "relative",
            margin: "1rem 0",
            backgroundColor: `${colors.containerBackgroundColor}`,
            color: `${colors.barColor}`
        }}>
        <h3>{title}</h3>
        <div style={{
            position: "absolute",
            left: 0,
            height: "100%",
            top: 0,
            backgroundColor: `${colors.barColor}`,
            width: "5px",
        }} />
        {contentJSXElementsFromAST}
    </div>);
}

export default BlockquoteMarkdown
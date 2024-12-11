import { useMemo } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import type { Element, RootContent } from 'hast'
import MainSection from '../MainSection';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { markdownComponents } from '.';
import { v4 as uuid } from 'uuid';

type BlockquoteElementType = "highlight-background" | "without-background";
type BlockquoteColorType = "base" | "secondary";
type TargetElementType = Record<BlockquoteElementType, Record<BlockquoteColorType, {
    containerBackgroundColor: string,
    barColor: string,
}>>
type BlockquoteMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLQuoteElement>;


const BlockquoteMarkdown = ({ node, className, ...props }: BlockquoteMarkdownProps) => {
    const { theme } = useThemeContext();
    const contentJSXElementsFromAST = useMemo(() => {
        let content = node?.children.map((element) => toJsxRuntime(element as RootContent, {
            Fragment, jsx, jsxs, passNode: true, components: {
                ...markdownComponents,
                br: () => null,
            },
        }));
        return content?.map((element) => (
            <Fragment key={uuid()}>{element}</Fragment>
        ));
    }, [node?.children]);

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

    if (className?.includes("popup")) {
        return (
            <MainSection>
                {contentJSXElementsFromAST}
            </MainSection>
        );
    }

    return (
        <div
            {...props as React.HTMLAttributes<HTMLDivElement>}
            style={{
                ...props.style,
                padding: "0 1rem",
                position: "relative",
                margin: "1rem 0",
                backgroundColor: `${colors.containerBackgroundColor}`,
                color: `${colors.barColor}`
            }}>
            <div style={{
                position: "absolute",
                left: 0,
                height: "100%",
                top: 0,
                backgroundColor: `${colors.barColor}`,
                width: "5px",
            }} />
            {contentJSXElementsFromAST}
        </div>
    );
}

export default BlockquoteMarkdown
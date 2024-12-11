import { CSSProperties, useMemo } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import type { Element, RootContent } from 'hast'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { markdownComponents } from '.';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import Button from '../Button';
import { v4 as uuid } from 'uuid';


type SpanElementType = "highlight-area" | "highlight-text";
type SpanColorType = "base" | "secondary";
type TargetElementType = Record<SpanElementType, Record<SpanColorType, CSSProperties>>;

type SpanMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLSpanElement>;

const SpanMarkdown = ({ node, className, ...props }: SpanMarkdownProps) => {
    const { theme } = useThemeContext();
    const classes = useMemo(() => className?.split(" ") ?? [], [className]);
    const contentJSXElementsFromAST = useMemo(() => {
        let content = node?.children;
        if (typeof content === 'string') return content;
        let result = node?.children.map((element) => toJsxRuntime(element as RootContent, {
            Fragment, jsx, jsxs, passNode: true, components: {
                ...markdownComponents,
                br: () => null,
            },
        }));
        return result?.map((element) => (
            <Fragment key={uuid()}>{element}</Fragment>
        ));
    }, [node?.children]);
    const targetElement = useMemo((): TargetElementType => ({
        "highlight-area": {
            "base": {
                fontWeight: 600,
                color: theme.colors.base[800],
                background: `linear-gradient(to bottom, transparent 60%, ${theme.colors.base[200]} 60%)`,
            },
            "secondary": {
                fontWeight: 600,
                color: theme.colors.base[800],
                background: `linear-gradient(to bottom, transparent 60%, ${theme.colors.secondary[300]} 60%)`
            },
        },
        "highlight-text": {
            "base": {
                fontWeight: 600,
            },
            "secondary": {
                color: theme.colors.secondary[500],
                fontWeight: 600,
            },
        },
    }), [theme.colors.base, theme.colors.secondary]);
    const spanElement = useMemo((): SpanElementType => {
        return classes.includes("highlight-area") ? "highlight-area" : "highlight-text";
    }, [classes]);
    const colorType = useMemo((): SpanColorType => {
        return classes.includes("secondary") ? "secondary" : "base";
    }, [classes]);
    const { style, children } = useMemo((): { style: CSSProperties, children: React.ReactNode } => {
        return {
            style: {
                ...props.style,
                ...targetElement[spanElement][colorType],
            },
            children: contentJSXElementsFromAST
        };
    }, [props.style, contentJSXElementsFromAST, targetElement, spanElement, colorType]);

    // `[[Button]]`
    if (classes.includes("button")) {
        return (
            <Button
                style={{
                    margin: "0.5rem",
                }}
                key={classes.join()}
                size='sm'>
                {contentJSXElementsFromAST}
            </Button>
        )
    }

    return (
        <span {...props} style={style}>
            {children}
        </span>
    );
}

export default SpanMarkdown
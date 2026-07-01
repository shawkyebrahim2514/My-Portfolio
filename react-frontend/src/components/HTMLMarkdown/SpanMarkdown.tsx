import { useMemo } from 'react';
import type { Element, RootContent } from 'hast'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { markdownComponents } from './markdownComponents';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import Button from '../Button';
import { v4 as uuid } from 'uuid';
import styles from './SpanMarkdown.module.css';


type SpanElementType = "highlight-area" | "highlight-text";
type SpanColorType = "base" | "secondary";

type SpanMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLSpanElement>;

const variantClass: Record<SpanElementType, Record<SpanColorType, string>> = {
    "highlight-area": {
        "base": styles.highlightAreaBase,
        "secondary": styles.highlightAreaSecondary,
    },
    "highlight-text": {
        "base": styles.highlightTextBase,
        "secondary": styles.highlightTextSecondary,
    },
};

const SpanMarkdown = ({ node, className, ...props }: SpanMarkdownProps) => {
    const classes = useMemo(() => className?.split(" ") ?? [], [className]);
    const contentJSXElementsFromAST = useMemo(() => {
        const content = node?.children;
        if (typeof content === 'string') return content;
        const result = node?.children.map((element) => toJsxRuntime(element as RootContent, {
            Fragment, jsx, jsxs, passNode: true, components: {
                ...markdownComponents,
                br: () => null,
            },
        }));
        return result?.map((element) => (
            <Fragment key={uuid()}>{element}</Fragment>
        ));
    }, [node?.children]);
    const spanElement = useMemo((): SpanElementType => {
        return classes.includes("highlight-area") ? "highlight-area" : "highlight-text";
    }, [classes]);
    const colorType = useMemo((): SpanColorType => {
        return classes.includes("secondary") ? "secondary" : "base";
    }, [classes]);

    // `[[Button]]`
    if (classes.includes("button")) {
        return (
            <Button
                className={styles.button}
                key={classes.join()}
                size='sm'>
                {contentJSXElementsFromAST}
            </Button>
        )
    }

    return (
        <span {...props} className={variantClass[spanElement][colorType]}>
            {contentJSXElementsFromAST}
        </span>
    );
}

export default SpanMarkdown

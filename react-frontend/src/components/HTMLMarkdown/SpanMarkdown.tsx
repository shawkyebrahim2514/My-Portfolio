import { useMemo } from 'react';
import type { Element } from 'hast'
import { useRenderedMarkdownChildren } from './renderMarkdownChildren';
import Button from '../Button';
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
    const contentJSXElementsFromAST = useRenderedMarkdownChildren(node);
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

import { useMemo } from 'react';
import type { Element } from 'hast'
import MainSection from '../MainSection';
import { useRenderedMarkdownChildren } from './renderMarkdownChildren';
import { cx } from '../../utils/cx';
import styles from './BlockquoteMarkdown.module.css';

type BlockquoteElementType = "highlight-background" | "without-background";
type BlockquoteColorType = "base" | "secondary";
type BlockquoteMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLQuoteElement>;


const BlockquoteMarkdown = ({ node, className, ...props }: BlockquoteMarkdownProps) => {
    const contentJSXElementsFromAST = useRenderedMarkdownChildren(node);

    // By default it will be without-background and base color
    const backgroundType = useMemo((): BlockquoteElementType => className?.includes("highlight") ? "highlight-background" : "without-background", [className]);
    const colorType = useMemo((): BlockquoteColorType => className?.includes("secondary") ? "secondary" : "base", [className]);

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
            className={cx(
                styles.blockquote,
                colorType === "secondary" ? styles.secondaryBar : styles.baseBar,
                backgroundType === "highlight-background" && (colorType === "secondary" ? styles.highlightSecondary : styles.highlightBase)
            )}>
            <div className={styles.bar} />
            {contentJSXElementsFromAST}
        </div>
    );
}

export default BlockquoteMarkdown

import { useMemo } from 'react';
import type { Element, RootContent } from 'hast'
import MainSection from '../MainSection';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { markdownComponents } from '.';
import { v4 as uuid } from 'uuid';
import { cx } from '../../utils/cx';
import styles from './BlockquoteMarkdown.module.css';

type BlockquoteElementType = "highlight-background" | "without-background";
type BlockquoteColorType = "base" | "secondary";
type BlockquoteMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLQuoteElement>;


const BlockquoteMarkdown = ({ node, className, ...props }: BlockquoteMarkdownProps) => {
    const contentJSXElementsFromAST = useMemo(() => {
        const content = node?.children.map((element) => toJsxRuntime(element as RootContent, {
            Fragment, jsx, jsxs, passNode: true, components: {
                ...markdownComponents,
                br: () => null,
            },
        }));
        return content?.map((element) => (
            <Fragment key={uuid()}>{element}</Fragment>
        ));
    }, [node?.children]);

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
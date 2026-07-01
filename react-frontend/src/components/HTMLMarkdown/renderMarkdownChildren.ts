import { useMemo } from 'react';
import type { Element, RootContent } from 'hast';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { markdownComponents } from './markdownComponents';

// Re-renders a hast Element's children through the shared markdown component
// map while suppressing <br>, so inline highlight/blockquote content stays on
// a single line. Shared by SpanMarkdown and BlockquoteMarkdown to avoid
// duplicating this recursive rendering block.
export function useRenderedMarkdownChildren(node?: Element) {
    return useMemo(() => {
        return node?.children.map((element, index) =>
            jsx(
                Fragment,
                {
                    children: toJsxRuntime(element as RootContent, {
                        Fragment,
                        jsx,
                        jsxs,
                        passNode: true,
                        components: {
                            ...markdownComponents,
                            br: () => null,
                        },
                    }),
                },
                index.toString(),
            ),
        );
    }, [node?.children]);
}

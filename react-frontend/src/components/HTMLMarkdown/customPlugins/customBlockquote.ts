import { findAndReplace } from 'mdast-util-find-and-replace'
import { visit } from 'unist-util-visit';
import type { Node } from 'hast'
import { Blockquote } from 'mdast'

export const customBlockquote = () => {
    return function (tree: Node) {
        visit(tree, 'blockquote', (node: Blockquote) => {
            findAndReplace(node, [
                /\[!([^[]+)\]\s?([a-z]*)/,
                (_fullText, variation, titleText) => {
                    // Tag the blockquote itself with the callout variation as a
                    // class. `node` is the blockquote we are visiting, so we no
                    // longer need to walk the match's ancestor stack by index.
                    node.data = {
                        hProperties: {
                            className: variation,
                        }
                    };
                    // If no title text is provided, drop the marker entirely.
                    if (titleText === "") return null;
                    // Promote the first child (the paragraph holding the title)
                    // to a depth-5 heading.
                    const titleParagraph = node.children[0];
                    if (titleParagraph) {
                        const asHeading = titleParagraph as unknown as { type: string; depth: number };
                        asHeading.type = "heading";
                        asHeading.depth = 5;
                    }
                    return {
                        type: 'text',
                        value: titleText
                    };
                }
            ])
        })
    }
};
import { findAndReplace } from 'mdast-util-find-and-replace'
import { visit } from 'unist-util-visit';
import type { Node } from 'hast'
import { Blockquote } from 'mdast'

export const customBlockquote = () => {
    return function (tree: Node) {
        visit(tree, 'blockquote', (node: Blockquote) => {
            findAndReplace(node, [
                /\[!([^\[]+)\]\s?([a-z]*)/,
                (fullText, variation, titleText, matchedNode) => {
                    // To modfiy the parent node (Blockquote) of the matched text
                    matchedNode.stack[matchedNode.stack.length - 3].data = {
                        hProperties: {
                            className: variation,
                        }
                    }
                    return {
                        type: 'heading',
                        depth: 5,
                        children: [
                            {
                                type: 'text',
                                value: titleText
                            }
                        ],
                    } as any;
                }
            ])
        })
    }
};
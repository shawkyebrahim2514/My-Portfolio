import { findAndReplace } from 'mdast-util-find-and-replace'
import { visit } from 'unist-util-visit';
import type { Node } from 'hast'
import { Nodes, Parent } from 'mdast'
import { toString } from 'mdast-util-to-string'

const textVariationsRegexReplace = {
    highlightAreaWithSecondaryColor: {
        regex: /!-(.*?)-!$/,
        replace: {
            className: 'highlight-area secondary',
        }
    },
    highlightTextWithSecondaryColor: {
        regex: /!(.*?)!$/,
        replace: {
            className: 'secondary',
        }
    },
    highlightAreaWithBaseColor: {
        regex: /-(.*?)-$/,
        replace: {
            className: 'highlight-area',
        }
    },
}

const handleVariationReplace = (variation: typeof textVariationsRegexReplace[keyof typeof textVariationsRegexReplace], node: Nodes): boolean => {
    let isMatched = false;
    findAndReplace(node, [
        variation.regex,
        (fullText: any, content: any) => {
            isMatched = true;
            return {
                type: 'strong',
                children: [
                    {
                        type: 'text',
                        value: content
                    }
                ],
                data: {
                    hProperties: {
                        className: variation.replace.className,
                    }
                }
            } as any;
        }
    ])
    return isMatched;
};

export const customHighlightText = () => {
    return function (tree: Node) {
        visit(tree, "strong", (node: Node) => {
            const currentNode = node as Parent;
            if (currentNode.children.length === 1) {
                for (const variation of Object.values(textVariationsRegexReplace)) {
                    if (handleVariationReplace(variation, currentNode as Nodes)) break;
                }
            } else {
                const nodeFullText = toString(node);
                for (const variation of Object.values(textVariationsRegexReplace)) {
                    if (variation.regex.test(nodeFullText)) {
                        node.data = {
                            hProperties: {
                                className: variation.replace.className,
                            }
                        };
                        break; // Exit the loop when the condition is met
                    }
                }
                (node as Parent).children.pop();
                (node as Parent).children.shift();
            }
        })
    }
};
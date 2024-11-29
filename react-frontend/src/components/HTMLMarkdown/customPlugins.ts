import { findAndReplace } from 'mdast-util-find-and-replace'
import { visit } from 'unist-util-visit';
import type { Node } from 'hast'
import { Nodes, Blockquote, Parent } from 'mdast'
import { toString } from 'mdast-util-to-string'

export const prepareBlockQuotes = () => {
    return function (tree: Node) {
        visit(tree, 'blockquote', (node: Blockquote) => {
            findAndReplace(node, [
                /\[!(.+)\](.*)/g,
                (fullText, variation, titleText) => {
                    node.data = {
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

const textVariationsRegexReplace = {
    button: {
        regex: /\[\[([a-zA-Z0-9\s]+)\]\]/g,
        replace: {
            className: 'button',
        }
    },
    highlightAreaWithSecondaryColor: {
        regex: /!-(.*?)-!/g, // /!-([a-zA-Z0-9\s]+)-!/g
        replace: {
            className: 'highlight-area secondary',
        }
    },
    highlightTextWithSecondaryColor: {
        regex: /!(.*?)!/g, // /!([a-zA-Z0-9\s]+)!/g
        replace: {
            className: 'secondary',
        }
    },
    highlightAreaWithBaseColor: {
        regex: /-(.*?)-/g, // /-([a-zA-Z0-9\s]+)-/g
        replace: {
            className: 'highlight-area',
        }
    },
}

const handleVariationReplace = (variation: typeof textVariationsRegexReplace[keyof typeof textVariationsRegexReplace], node: Nodes) => {
    findAndReplace(node, [
        variation.regex,
        (fullText: any, content: any) => {
            console.log('content', content);
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
};

export const prepareTextVariations = () => {
    return function (tree: Node) {
        visit(tree, "strong", (node: Node) => {
            const currentNode = node as Parent;
            if (currentNode.children.length === 1) {
                Object.values(textVariationsRegexReplace).forEach((variation) => {
                    handleVariationReplace(variation, currentNode as Nodes);
                })
            } else {
                const nodeFullText = toString(node);
                Object.values(textVariationsRegexReplace).forEach((variation) => {
                    if (variation.regex.test(nodeFullText)) {
                        node.data = {
                            hProperties: {
                                className: variation.replace.className,
                            }
                        };
                    }
                });
                (node as Parent).children.pop();
                (node as Parent).children.shift();
            }
        })
    }
};
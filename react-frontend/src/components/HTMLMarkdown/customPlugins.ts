import { findAndReplace } from 'mdast-util-find-and-replace'
import { visit } from 'unist-util-visit';
import type { Node } from 'hast'
import { Nodes, Blockquote, Parent, Image, Root, RootContent, Paragraph } from 'mdast'
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
        regex: /\[\[([a-zA-Z0-9\s]+)\]\]/,
        replace: {
            className: 'button',
        }
    },
    highlightAreaWithSecondaryColor: {
        regex: /!-(.*?)-!/,
        replace: {
            className: 'highlight-area secondary',
        }
    },
    highlightTextWithSecondaryColor: {
        regex: /!(.*?)!/,
        replace: {
            className: 'secondary',
        }
    },
    highlightAreaWithBaseColor: {
        regex: /-(.*?)-/,
        replace: {
            className: 'highlight-area',
        }
    },
}

const handleVariationReplace = (variation: typeof textVariationsRegexReplace[keyof typeof textVariationsRegexReplace], node: Nodes) => {
    findAndReplace(node, [
        variation.regex,
        (fullText: any, content: any) => {
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

// let imageRegex = /!\[([^\]]+)\]\(([^ ]+)\s*=\s*(\d+)x?(\d+)?\|?([^\)]+)?\)/;
let imageRegex = /!\[([^\]]+)\]\(([^ ]+)\s?(?:=(\d+)x?(\d+)?)?(?:\|((?:center|left|right)+))?\)/;

const imageNodeStyle: React.CSSProperties = ({
    maxWidth: `100%`,
    maxHeight: `100%`
});

const imageWrapperNodeStyle = (width: number, height: number): React.CSSProperties => ({
    flexGrow: 1,
    maxWidth: width ? `${width}px` : '100%',
    maxHeight: height ? `${height}px` : '100%',
});

const alignToFlex = (align: string): string => {
    if (align === 'center') {
        return 'center';
    } else if (align === 'right') {
        return 'flex-end';
    } else {
        return 'flex-start';
    }
}

const imageContainerStyle = (align: string): React.CSSProperties => {
    return {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: alignToFlex(align),
        gap: '10px',
    }
}

export const customImagePlugin = () => {
    return function (tree: Nodes) {
        visit(tree, 'paragraph', (node: Nodes) => {
            let nodeFullText = toString(node);
            const match = imageRegex.exec(nodeFullText);
            if (match) {
                console.log('match', match);
                const fragments = nodeFullText.split(imageRegex);
                const currentNode = node as Parent;
                const imageNodes: RootContent[] = [];
                let align: string = 'left';
                for (let i = 0; i < (fragments.length - 1) / 6; i++) {
                    const range = i * 6;
                    const altText = fragments[range + 1];
                    const url = fragments[range + 2];
                    const width = fragments[range + 3];
                    const height = fragments[range + 4];
                    align = fragments[range + 5];
                    const imageNode: Image = {
                        type: 'image',
                        url: url,
                        alt: altText,
                        data: {
                            hProperties: {
                                className: 'image',
                                style: Object.entries(imageNodeStyle)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join('; '),
                            }
                        }
                    };
                    imageNodes.push({
                        type: 'paragraph',
                        children: [imageNode],
                        data: {
                            hProperties: {
                                className: 'image-container',
                                style: Object.entries(imageWrapperNodeStyle(parseInt(width), parseInt(height)))
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join('; ')
                            }
                        }
                    });
                }
                currentNode.children = imageNodes;
                currentNode.data = {
                    hProperties: {
                        className: 'image',
                        style: Object.entries(imageContainerStyle(align))
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('; '),
                    }
                }
            }
        })
    };
};
import { visit } from 'unist-util-visit';
import { Nodes, Parent, Image, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'


const imageRegex = /!\[([^\]]+)\]\(([^ ]+)\s?(?:=(?:(\d+)x(\d+)|(h|w)(\d+)))?(?:\|(center|left|right))?\)/;

// Only genuinely dynamic values (user-specified pixel dimensions) are emitted
// inline, and only as CSS custom properties consumed by the stylesheet. All
// static layout lives in HTMLMarkdown.module.css under :global(.md-image-*).
const imageFrameVars = (width: number, height: number): string => {
    let maxWidth = "100%";
    let maxHeight = "100%";
    if (!width) {
        maxHeight = `${height}px`;
    } else if (!height) {
        maxWidth = `min(100%, ${width}px)`;
    } else {
        maxWidth = `min(100%, ${width}px)`;
        maxHeight = `min(100%, ${height}px)`;
    }
    return `--md-image-max-w: ${maxWidth}; --md-image-max-h: ${maxHeight}`;
};

const alignModifier = (align: string): string => {
    if (align === 'center') return 'md-image-row--center';
    if (align === 'right') return 'md-image-row--right';
    return 'md-image-row--left';
};

export const customImage = () => {
    return function (tree: Nodes) {
        visit(tree, 'paragraph', (node: Nodes) => {
            const nodeFullText = toString(node);
            const match = imageRegex.exec(nodeFullText);
            if (match) {
                const fragments = nodeFullText.split(imageRegex);
                const currentNode = node as Parent;
                const imageNodes: RootContent[] = [];
                let align: string = 'left';
                for (let i = 0; i < (fragments.length - 1) / 8; i++) {
                    const range = i * 8;
                    const altText = fragments[range + 1];
                    const url = fragments[range + 2];
                    let width = fragments[range + 3];
                    let height = fragments[range + 4];
                    const widthOrHeight = fragments[range + 5];
                    if (widthOrHeight) {
                        if (widthOrHeight === 'w') {
                            width = fragments[range + 6];
                        } else {
                            height = fragments[range + 6];
                        }
                    }
                    align = fragments[range + 7];
                    const imageNode: Image = {
                        type: 'image',
                        url: url,
                        alt: altText,
                        data: {
                            hProperties: {
                                className: 'md-image',
                                loading: 'lazy',
                                decoding: 'async',
                            }
                        }
                    };
                    imageNodes.push({
                        type: 'paragraph',
                        children: [imageNode],
                        data: {
                            hName: 'div',
                            hProperties: {
                                className: 'md-image-frame',
                                style: imageFrameVars(parseInt(width), parseInt(height)),
                            }
                        }
                    });
                }
                currentNode.children = imageNodes;
                currentNode.data = {
                    hName: 'div',
                    hProperties: {
                        className: `md-image-row ${alignModifier(align)}`,
                    }
                }
            }
        })
    };
};
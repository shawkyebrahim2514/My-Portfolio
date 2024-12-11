import { visit } from 'unist-util-visit';
import { Nodes, Parent, Image, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'


let imageRegex = /!\[([^\]]+)\]\(([^ ]+)\s?(?:=(?:(\d+)x(\d+)|(h|w)(\d+)))?(?:\|(center|left|right))?\)/;

const imageNodeStyle: React.CSSProperties = ({
    maxWidth: `inherit`,
    maxHeight: `inherit`,
});

const imageWrapperNodeStyle = (width: number, height: number): React.CSSProperties => {
    let finalWidth = "100%";
    let finalHeight = "100%";
    if (!width) {
        finalHeight = `${height}px`;
    } else if (!height) {
        finalWidth = `min(100%, ${width}px)`;
    } else {
        finalWidth = `min(100%, ${width}px)`;
        finalHeight = `min(100%, ${height}px)`;
    }
    return {
        maxWidth: finalWidth,
        maxHeight: finalHeight,
    };
}

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
        alignItems: 'center',
        gap: '10px',
    }
}

export const customImage = () => {
    return function (tree: Nodes) {
        visit(tree, 'paragraph', (node: Nodes) => {
            let nodeFullText = toString(node);
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
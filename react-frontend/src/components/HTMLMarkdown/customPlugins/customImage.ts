import { visit } from 'unist-util-visit';
import { Nodes, Parent, Image, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'


let imageRegex = /!\[([^\]]+)\]\(([^ ]+)\s?(?:=(\d+)x?(\d+)?)?(?:\|(center|left|right))?\)/;

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
        alignItems: 'center',
        gap: '10px',
    }
}

export const customImagePlugin = () => {
    return function (tree: Nodes) {
        visit(tree, 'paragraph', (node: Nodes) => {
            let nodeFullText = toString(node);
            const match = imageRegex.exec(nodeFullText);
            if (match) {
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
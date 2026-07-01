import { visit } from 'unist-util-visit';
import { Nodes, Parent } from 'mdast'

/**
 * A standalone link (`[text](url)`) is rendered by AncherLinkMarkdown as a
 * block-level Header/Button. react-markdown wraps it in a <p>, producing an
 * invalid <p><div>…</div></p>. When a paragraph contains only a link, render
 * the paragraph as a <div> so the block content nests validly.
 */
export const customLink = () => {
    return function (tree: Nodes) {
        visit(tree, 'paragraph', (node: Nodes) => {
            const paragraph = node as Parent;
            if (paragraph.children.length === 1 && paragraph.children[0].type === 'link') {
                paragraph.data = {
                    ...(paragraph.data ?? {}),
                    hName: 'div',
                };
            }
        });
    };
};

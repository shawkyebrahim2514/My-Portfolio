import { findAndReplace, ReplaceFunction } from 'mdast-util-find-and-replace'
import { visit } from 'unist-util-visit';
import type { Node } from 'hast'
import { Nodes, Parent } from 'mdast'
import { captureTextDirection } from './captureTextDirection'
import { captureNewline } from './captureNewline'
import { captureButton } from './captureButton';
import { captureGap } from './captureGap';

export type customType = { regex: RegExp, callback: ReplaceFunction }

export const customText = () => {
    return function (tree: Node) {
        visit(tree, (node: Node) => {
            if (node && 'children' in node && (node as Parent).children.some((child) => child.type === 'text')) {
                const customTextPlugins: customType[] = [
                    captureTextDirection(node as Nodes),
                    captureNewline(node as Nodes),
                    captureButton(node as Nodes),
                    captureGap(node as Nodes)
                ]
                customTextPlugins.forEach(({ regex, callback }) => {
                    while (true) {
                        let exists = false;
                        findAndReplace(node as Nodes, [
                            regex,
                            (...args) => {
                                exists = true;
                                return callback(...args)
                            },
                        ]);
                        if (!exists) {
                            break;
                        }
                    }
                })
            }
        })
    }
};

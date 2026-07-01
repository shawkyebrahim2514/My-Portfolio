import type { Node } from 'hast'
import type { customType } from '.'

export const captureTextDirection = (node: Node): customType => ({
    regex: /\[(center|left|right)\]/,
    callback: (fullText: string, align: string) => {
        node.data = {
            hProperties: {
                style: "text-align: " + align
            }
        }
        return null;
    }
})
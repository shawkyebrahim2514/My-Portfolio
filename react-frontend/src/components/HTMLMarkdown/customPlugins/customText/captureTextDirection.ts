import type { Node } from 'hast'
import type { customType } from '.'

export const captureTextDirection = (node: Node): customType => ({
    regex: /\[(center|left|right)\]/,
    callback: (_fullText: string, align: string) => {
        node.data = {
            hProperties: {
                className: `md-align-${align}`
            }
        }
        return null;
    }
})
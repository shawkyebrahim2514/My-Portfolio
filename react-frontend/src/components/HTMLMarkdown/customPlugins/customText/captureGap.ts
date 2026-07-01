import type { Node } from 'hast'
import type { PhrasingContent } from 'mdast'
import type { customType } from '.'

export const captureGap = (_node: Node): customType => ({
    regex: /\[gap\]/,
    callback: (_fullText: string) => ({
        type: 'paragraph',
        children: [],
        data: {
            hName: 'span',
            hProperties: {
                className: 'md-gap'
            }
        }
    } as unknown as PhrasingContent)
})
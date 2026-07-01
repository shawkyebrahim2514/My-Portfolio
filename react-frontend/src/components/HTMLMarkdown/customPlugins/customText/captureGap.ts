import type { Node } from 'hast'
import type { PhrasingContent } from 'mdast'
import type { customType } from '.'

export const captureGap = (node: Node): customType => ({
    regex: /\[gap\]/,
    callback: (fullText: string) => ({
        type: 'paragraph',
        children: [],
        data: {
            hProperties: {
                style: "margin: 0 1rem 1rem 0; display: inline-block;"
            }
        }
    } as unknown as PhrasingContent)
})
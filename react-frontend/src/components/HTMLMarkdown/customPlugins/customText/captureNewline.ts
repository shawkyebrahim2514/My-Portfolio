import type { Node } from 'hast'
import type { PhrasingContent } from 'mdast'
import type { customType } from '.'

export const captureNewline = (_node: Node): customType => ({
    regex: /\[newline\]/,
    callback: (_fullText: string) => {
        return ({
            type: 'paragraph',
            children: [],
            data: {
                hName: 'span',
                hProperties: {
                    className: 'md-newline'
                }
            }
        } as unknown as PhrasingContent)
    }
})
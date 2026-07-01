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
                    style: "margin: 0.5rem 0; display: grid;"
                }
            }
        } as unknown as PhrasingContent)
    }
})
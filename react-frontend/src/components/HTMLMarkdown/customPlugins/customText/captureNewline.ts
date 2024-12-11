import type { Node } from 'hast'
import type { customType } from '.'

export const captureNewline = (node: Node): customType => ({
    regex: /\[newline\]/,
    callback: (fullText: any) => {
        return ({
            type: 'paragraph',
            children: [],
            data: {
                hProperties: {
                    style: "margin: 0.5rem 0; display: grid;"
                }
            }
        } as any)
    }
})
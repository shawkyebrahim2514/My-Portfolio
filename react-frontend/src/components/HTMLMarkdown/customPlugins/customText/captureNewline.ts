import type { Node } from 'hast'
import type { customType } from '.'

export const captureNewline = (node: Node): customType => ({
    regex: /\[newline\]/,
    callback: (fullText: any) => {
        return {
            type: 'break'
        }
    }
})
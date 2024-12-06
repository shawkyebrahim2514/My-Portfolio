import type { Node } from 'hast'
import type { customType } from '.'

export const captureButton = (node: Node): customType => ({
    regex: /\[\[([a-zA-Z0-9\s]+)\]\]/,
    callback: (fullText: any, content: any) => {
        return {
            type: 'strong',
            children: [
                {
                    type: 'text',
                    value: content
                }
            ],
            data: {
                hProperties: {
                    className: 'button',
                }
            }
        };
    }
})
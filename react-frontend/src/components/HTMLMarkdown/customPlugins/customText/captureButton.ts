import type { Node } from 'hast'
import type { customType } from '.'

export const captureButton = (_node: Node): customType => ({
    regex: /\[\[([a-zA-Z0-9\s]+)\]\]/,
    callback: (_fullText: string, content: string) => {
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
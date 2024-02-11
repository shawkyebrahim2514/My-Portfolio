export const commanTitle = {
    name: 'title',
    type: 'object',
    title: 'Title',
    fields: [
        {
            name: 'highlightedText',
            type: 'string',
            title: 'Highlighted Text',
            validation: Rule => Rule.required()
        },
        {
            name: 'subText',
            type: 'string',
            title: 'Sub Text',
            validation: Rule => Rule.required()
        }
    ],
    validation: Rule => Rule.required()
}

export const changeDocumentPreviewTitle = (title: string) => {
    return {
        preview: {
            prepare() {
                return {
                    title: title,
                }
            }
        },
    }
}
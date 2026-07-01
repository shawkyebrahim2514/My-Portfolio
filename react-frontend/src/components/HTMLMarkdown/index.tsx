import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks'
import { markdownComponents } from './markdownComponents';
import { customBlockquote, customHighlightText, customImage, customText } from './customPlugins';

type Props = {
    readonly markdown: string
}

function HTMLMarkdown({ markdown }: Props) {
    return (
        <ReactMarkdown
            remarkPlugins={[
                remarkGfm,
                remarkBreaks,
                customImage,
                customText,
                customHighlightText,
                customBlockquote
            ]}
            components={markdownComponents}
            >
            {markdown}
        </ReactMarkdown>
    )
}

export default HTMLMarkdown
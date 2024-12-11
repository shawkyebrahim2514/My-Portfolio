import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks'
import HrMarkdown from './HrMarkdown';
import UlMarkdown from './UlMarkdown';
import LiMarkdown from './LiMarkdown';
import HeadingMarkdown from './HeadingMarkdown';
import SpanMarkdown from './SpanMarkdown';
import BlockquoteMarkdown from './BlockquoteMarkdown';
import AncherLinkMarkdown from './AncherLinkMarkdown';
import { customBlockquote, customHighlightText, customImage, customText } from './customPlugins';

type Props = {
    readonly markdown: string
}

export const markdownComponents: Components = {
    hr: ({ node, ...props }) => <HrMarkdown {...props} />,
    ul: ({ node, ...props }) => <UlMarkdown {...props} />,
    li: ({ node, ...props }) => <LiMarkdown {...props} />,
    h1: ({ node, ...props }) => <HeadingMarkdown headingNumber='one' {...props} />,
    h2: ({ node, ...props }) => <HeadingMarkdown headingNumber='two' {...props} />,
    h3: ({ node, ...props }) => <HeadingMarkdown headingNumber='three' {...props} />,
    h4: ({ node, ...props }) => <HeadingMarkdown headingNumber='four' {...props} />,
    h5: ({ node, ...props }) => <HeadingMarkdown headingNumber='five' {...props} />,
    h6: ({ node, ...props }) => <HeadingMarkdown headingNumber='six' {...props} />,
    span: ({ node, ...props }) => <SpanMarkdown node={node} {...props} />,
    strong: ({ node, ...props }) => <SpanMarkdown node={node} {...props} />,
    blockquote: ({ node, ...props }) => <BlockquoteMarkdown node={node} {...props} />,
    a: ({ node, ...props }) => <AncherLinkMarkdown node={node} {...props} />,
};

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
import React, { CSSProperties, useMemo, useState } from 'react';
import HTMLMarkdown from '../../components/HTMLMarkdown';
import ContainerWrap from '../../components/ContainerWrap';

const MarkdownEditor = () => {
    const [markdown, setMarkdown] = useState<string>('');

    const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(event.target.value);
    };

    const textAreaStyle = useMemo((): CSSProperties => ({
        flex: 1,
        minHeight: '150px',
        padding: '15px',
        fontSize: '16px',
        resize: 'vertical',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        outline: 'none',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.5',
        marginBottom: '20px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
    }), []);

    return (
        <div style={{ display: 'grid' }}>
            <textarea
                style={textAreaStyle}
                value={markdown}
                onChange={handleMarkdownChange}
                placeholder="Write your Markdown here..."
            />
            <div style={{ flex: 1, padding: '10px', borderTop: '1px solid #ccc' }}>
                <HTMLMarkdown markdown={markdown} />
            </div>
        </div>
    );
};

export default ContainerWrap(MarkdownEditor);
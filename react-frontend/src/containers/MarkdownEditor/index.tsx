import React, { useState } from 'react';
import HTMLMarkdown from '../../components/HTMLMarkdown';
import ContainerWrap from '../../components/ContainerWrap';
import styles from './MarkdownEditor.module.css';

const MarkdownEditor = () => {
    const [markdown, setMarkdown] = useState<string>('');

    const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(event.target.value);
    };

    return (
        <div className={styles.editor}>
            <textarea
                className={styles.textarea}
                value={markdown}
                onChange={handleMarkdownChange}
                placeholder="Write your Markdown here..."
            />
            <div className={styles.preview}>
                <HTMLMarkdown markdown={markdown} />
            </div>
        </div>
    );
};

export default ContainerWrap(MarkdownEditor);
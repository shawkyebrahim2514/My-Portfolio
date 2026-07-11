import { memo, useCallback, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import type { RichCode } from '../../Types';
import styles from './CodeBlock.module.css';

// Register only the languages exposed in the Studio dropdown (see
// sanity-backend/schemas/objects/richContent.ts) so PrismLight stays small
// instead of bundling every Prism grammar.
const LANGUAGES: Record<string, Parameters<typeof SyntaxHighlighter.registerLanguage>[1]> = {
    bash,
    javascript,
    typescript,
    jsx,
    tsx,
    json,
    markup,
    css,
    python,
    go,
    sql,
    markdown,
};
Object.entries(LANGUAGES).forEach(([name, def]) => SyntaxHighlighter.registerLanguage(name, def));

// Friendly labels for the header chip (falls back to the raw language value).
const LANGUAGE_LABELS: Record<string, string> = {
    text: 'Text',
    bash: 'Shell',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    jsx: 'JSX',
    tsx: 'TSX',
    json: 'JSON',
    markup: 'HTML',
    css: 'CSS',
    python: 'Python',
    go: 'Go',
    sql: 'SQL',
    markdown: 'Markdown',
};

type CodeBlockProps = { value: RichCode };

function CodeBlock({ value }: CodeBlockProps) {
    const { code = '', language = 'text', filename, highlightedLines } = value;
    const [copied, setCopied] = useState(false);

    const onCopy = useCallback(() => {
        navigator.clipboard?.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }, [code]);

    const highlighted = new Set(highlightedLines ?? []);
    const label = LANGUAGE_LABELS[language] ?? language;

    return (
        // dir="ltr" so code always reads left-to-right even inside an RTL
        // (Arabic) article; lang is unset so the code font applies, not the
        // Arabic face.
        <figure className={styles.wrapper} dir="ltr">
            <figcaption className={styles.header}>
                <span className={styles.filename}>{filename || label}</span>
                {filename && <span className={styles.lang}>{label}</span>}
                <button type="button" className={styles.copy} onClick={onCopy} aria-label="Copy code">
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </figcaption>
            <SyntaxHighlighter
                language={language}
                style={oneLight}
                showLineNumbers
                wrapLines
                customStyle={{
                    margin: 0,
                    background: 'transparent',
                    fontSize: 'var(--font-size-sm)',
                    padding: 'var(--space-3)',
                }}
                codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
                lineNumberStyle={{ minWidth: '2.5em', color: 'var(--color-base-400)' }}
                lineProps={(lineNumber) =>
                    highlighted.has(lineNumber) ? { className: styles.highlightedLine } : {}
                }
            >
                {code}
            </SyntaxHighlighter>
        </figure>
    );
}

export default memo(CodeBlock);

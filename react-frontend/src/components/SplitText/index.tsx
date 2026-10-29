import type { ElementType, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './SplitText.module.css';

type SplitTextProps = {
    text: string;
    tag?: ElementType;
    className?: string;
    /** Stagger delay in ms applied between each character's reveal. */
    delay?: number;
};

function SplitText({ text, tag: Tag = 'span', className, delay = 50 }: SplitTextProps) {
    const words = text.split(' ');
    let charIndex = 0;
    const nodes: ReactNode[] = [];
    words.forEach((word, wi) => {
        if (word)
            nodes.push(
                <span key={`w-${wi}`} className={styles.word}>
                    {Array.from(word).map((char) => {
                        const i = charIndex;
                        charIndex += 1;
                        return (
                            <span
                                key={i}
                                className={styles.char}
                                style={{ animationDelay: `${i * delay}ms` }}
                            >
                                {char}
                            </span>
                        );
                    })}
                </span>
            );
        // A literal space text node (not a styled span) between words keeps
        // `textContent` byte-identical to the source string and lets lines
        // wrap normally between words.
        if (wi < words.length - 1) nodes.push(' ');
    });

    return <Tag className={cx(styles.splitText, className)}>{nodes}</Tag>;
}

export default SplitText;

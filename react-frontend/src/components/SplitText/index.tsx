// Reveals `text` one character at a time via a staggered opacity/translateY
// transition, ported from React Bits' SplitText. The original demo relies on
// GSAP's SplitText plugin + ScrollTrigger; this project stays
// zero-dependency, so it's reimplemented with plain <span> characters and
// CSS transitions, triggered once on mount — the only use case here is an
// above-the-fold hero title, not a scroll-triggered reveal.
import { useEffect, useState, type ElementType, type ReactNode } from 'react';
import { useReducedMotion } from '@react-spring/web';
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
    const reduceMotion = useReducedMotion();
    // Reduced motion: render fully visible immediately, skip the animation
    // entirely (matches this project's established pattern for motion
    // effects) rather than freezing mid-transition.
    const [visible, setVisible] = useState(reduceMotion);

    useEffect(() => {
        if (reduceMotion) return;
        // Double rAF so the browser commits the initial (invisible) frame
        // before the class toggle that starts the CSS transition.
        const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        return () => cancelAnimationFrame(raf);
    }, [reduceMotion]);

    const words = text.split(' ');
    let charIndex = 0;
    const nodes: ReactNode[] = [];
    words.forEach((word, wi) => {
        nodes.push(
            <span key={`w-${wi}`} className={styles.word}>
                {Array.from(word).map((char) => {
                    const i = charIndex;
                    charIndex += 1;
                    return (
                        <span
                            key={i}
                            className={cx(styles.char, visible && styles.charVisible)}
                            style={{ transitionDelay: `${i * delay}ms` }}
                        >
                            {char}
                        </span>
                    );
                })}
            </span>,
        );
        // A literal space text node (not a styled span) between words keeps
        // `textContent` byte-identical to the source string and lets lines
        // wrap normally between words.
        if (wi < words.length - 1) nodes.push(' ');
    });

    return (
        <Tag className={cx(styles.splitText, className)}>
            {nodes}
        </Tag>
    );
}

export default SplitText;

// A ring of characters that continuously rotates around its own center,
// ported from React Bits' CircularText. The original uses the `motion`
// library for the rotation tween + a hover speed-up; this project stays
// zero-dependency, so rotation is a plain CSS `@keyframes` spin (paused
// entirely under prefers-reduced-motion via a CSS media query — no JS
// needed). The hover speed-up is dropped: this component wraps around the
// home page's circular avatar photo, so its bounding box overlaps the photo
// and fighting over pointer-events/z-index for a "nice to have" interaction
// isn't worth the complexity — it's `pointer-events: none` and purely
// decorative (`aria-hidden`).
//
// Each character is positioned via the classic circular-text CSS trick: an
// absolutely-positioned <span> filling the whole circle, text centered at
// its top edge, then rotated by its own even share of 360° around the
// shared center — no trigonometry needed.
import { type CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import styles from './CircularText.module.css';

type CircularTextProps = {
    text: string;
    /** Diameter of the circle — a number is treated as px; a string is used
     *  as-is (e.g. a `clamp()`/`calc()` expression for responsive sizing). */
    size?: number | string;
    /** Duration in seconds for one full rotation. */
    spinDuration?: number;
    className?: string;
};

function CircularText({ text, size = 200, spinDuration = 20, className }: CircularTextProps) {
    const letters = Array.from(text);
    const style = {
        '--circular-text-size': typeof size === 'number' ? `${size}px` : size,
        '--circular-text-spin-duration': `${spinDuration}s`,
    } as CSSProperties;

    return (
        <div className={cx(styles.circularText, className)} style={style} aria-hidden="true">
            {letters.map((letter, i) => {
                const deg = (360 / letters.length) * i;
                return (
                    <span key={i} style={{ transform: `rotate(${deg}deg)` }}>
                        {letter === ' ' ? '\u00A0' : letter}
                    </span>
                );
            })}
        </div>
    );
}

export default CircularText;

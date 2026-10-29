import { useId, type CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import styles from './CircularText.module.css';

type CircularTextProps = {
    text: string;
    size?: number | string;
    spinDuration?: number;
    className?: string;
};

function CircularText({ text, size = 200, spinDuration = 20, className }: CircularTextProps) {
    const pathId = useId();
    const style = {
        '--circular-text-size': typeof size === 'number' ? `${size}px` : size,
        '--circular-text-spin-duration': `${spinDuration}s`,
    } as CSSProperties;

    return (
        <svg
            className={cx(styles.circularText, className)}
            style={style}
            viewBox="0 0 200 200"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <path id={pathId} d="M 100 17 a 83 83 0 1 1 0 166 a 83 83 0 1 1 0 -166" />
            </defs>
            <text textLength={2 * Math.PI * 83} lengthAdjust="spacing">
                <textPath href={`#${pathId}`}>{text}</textPath>
            </text>
        </svg>
    );
}

export default CircularText;

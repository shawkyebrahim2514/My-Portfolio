import { cx } from '../../utils/cx';
import styles from './Button.module.css';

type ButtonProps = {
    readonly icon?: React.JSX.Element;
    readonly text?: string;
    readonly onClick?: () => void;
    readonly size?: 'sm' | 'md' | 'lg';
    readonly variant?: 'solid' | 'ghost';
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly pointer?: boolean;
    readonly children?: React.ReactNode;
    readonly ariaLabel?: string;
};

export default function Button({
    icon,
    text,
    onClick,
    size = 'lg',
    variant = 'solid',
    style,
    className,
    pointer,
    children,
    ariaLabel,
}: ButtonProps) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            className={cx(
                styles.button,
                styles[size],
                variant === 'ghost' && styles.ghost,
                pointer && styles.pointer,
                className
            )}
            style={style}
            onClick={onClick}
        >
            {icon}
            {text}
            {children}
        </button>
    );
}

import { cx } from '../../utils/cx';
import styles from './Button.module.css';

type ButtonProps = {
    readonly icon?: React.JSX.Element;
    readonly text?: string;
    readonly onClick?: () => void;
    readonly size?: 'sm' | 'md' | 'lg';
    readonly style?: React.CSSProperties;
    readonly pointer?: boolean;
    readonly children?: React.ReactNode;
};

export default function Button({
    icon,
    text,
    onClick,
    size = 'lg',
    style,
    pointer,
    children,
}: ButtonProps) {
    return (
        <button
            type="button"
            className={cx(styles.button, styles[size], pointer && styles.pointer)}
            style={style}
            onClick={onClick}
        >
            {icon}
            {text}
            {children}
        </button>
    );
}

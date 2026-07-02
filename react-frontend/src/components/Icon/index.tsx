import Text from '../Text';
import { cx } from '../../utils/cx';
import styles from './Icon.module.css';

type IconProps = {
    readonly src?: string;
    readonly alt?: string;
    readonly text?: string;
    readonly pointer?: boolean;
    readonly onClick?: () => void;
    readonly href?: string;
    readonly size?: 'lg' | 'md';
};

export default function Icon({
    src,
    alt,
    text,
    pointer = false,
    onClick,
    href,
    size = 'md',
}: IconProps) {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onClick();
        }
    };

    const className = cx(styles.icon, styles[size], pointer && styles.pointer);
    const inner = (
        <>
            <div className={styles.imageFrame}>
                {/* When the icon is a link, its text label names the control,
                    so the image is decorative and must not be double-announced. */}
                <img className={styles.image} src={src ?? 'images/placeholder.png'} alt={href ? '' : alt} />
            </div>
            {text && <Text variant={'body'}>{text}</Text>}
        </>
    );

    if (href) {
        return (
            <a
                className={className}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={text ? `${text} (opens in new tab)` : undefined}>
                {inner}
            </a>
        );
    }

    return (
        <div
            className={className}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {inner}
        </div>
    );
}

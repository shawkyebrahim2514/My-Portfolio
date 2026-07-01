import Text from '../Text';
import { cx } from '../../utils/cx';
import styles from './Icon.module.css';

type IconProps = {
    readonly src?: string;
    readonly alt?: string;
    readonly text?: string;
    readonly pointer?: boolean;
    readonly onClick?: () => void;
    readonly size?: 'lg' | 'md';
};

export default function Icon({
    src,
    alt,
    text,
    pointer = false,
    onClick,
    size = 'md',
}: IconProps) {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onClick();
        }
    };

    return (
        <div
            className={cx(styles.icon, styles[size], pointer && styles.pointer)}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <div className={styles.imageFrame}>
                <img className={styles.image} src={src ?? 'images/placeholder.png'} alt={alt} />
            </div>
            {text && <Text variant={'body'}>{text}</Text>}
        </div>
    );
}

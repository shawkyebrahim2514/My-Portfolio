import { memo } from 'react';
import styles from './ExitButton.module.css';

type ExitButtonProps = {
    readonly onClose: () => void;
};

// A round "bubble" close button matching the BubbleMenu toggle's visual
// language — two crossed lines forming a static X — instead of the
// FontAwesome circle-X icon.
function ExitButton({ onClose }: ExitButtonProps) {
    return (
        <button
            type="button"
            className={styles.bubble}
            aria-label="Close navigation menu"
            onClick={onClose}
        >
            <span className={styles.line} />
            <span className={styles.line} />
        </button>
    );
}

export default memo(ExitButton);

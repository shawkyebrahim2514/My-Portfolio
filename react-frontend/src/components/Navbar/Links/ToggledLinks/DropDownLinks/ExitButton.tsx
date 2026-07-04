import { memo, useCallback } from 'react';
import styles from './ExitButton.module.css';

type ExitButtonProps = {
    readonly setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// A round "bubble" close button matching the BubbleMenu toggle's visual
// language — two crossed lines forming a static X — instead of the
// FontAwesome circle-X icon.
function ExitButton({ setIsMenuOpen }: ExitButtonProps) {
    const clickHandler = useCallback(() => {
        setIsMenuOpen(false);
    }, [setIsMenuOpen]);

    return (
        <button
            type="button"
            className={styles.bubble}
            aria-label="Close navigation menu"
            onClick={clickHandler} >
            <span className={styles.line} />
            <span className={styles.line} />
        </button>
    )
}

export default memo(ExitButton);

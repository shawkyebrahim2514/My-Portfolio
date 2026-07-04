import { memo, useCallback } from 'react';
import styles from './BarsIcon.module.css';
import { cx } from '../../../../utils/cx';

type BarsIconProps = {
    readonly isMenuOpen: boolean,
    readonly setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// A round "bubble" toggle button (react-bits BubbleMenu style) whose two
// bars morph into an X via pure CSS transforms — no icon library needed for
// this one.
function BarsIcon({ isMenuOpen, setIsMenuOpen }: BarsIconProps) {
    const clickHandler = useCallback(() => {
        setIsMenuOpen((oldIsMenuOpen) => !oldIsMenuOpen);
    }, [setIsMenuOpen]);

    return (
        <button
            type="button"
            className={cx(styles.bubble, isMenuOpen && styles.open)}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={clickHandler} >
            <span className={styles.line} />
            <span className={styles.line} />
        </button>
    )
}

export default memo(BarsIcon);
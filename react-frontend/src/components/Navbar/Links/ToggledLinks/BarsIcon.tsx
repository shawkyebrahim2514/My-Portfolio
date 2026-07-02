import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { memo, useCallback } from 'react';
import styles from './BarsIcon.module.css';

type BarsIconProps = {
    readonly isMenuOpen: boolean,
    readonly setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function BarsIcon({ isMenuOpen, setIsMenuOpen }: BarsIconProps) {
    const clickHandler = useCallback(() => {
        setIsMenuOpen((oldIsMenuOpen) => !oldIsMenuOpen);
    }, [setIsMenuOpen]);

    return (
        <button
            type="button"
            className={styles.bars}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={clickHandler} >
            <FontAwesomeIcon icon={faBars} size={"xl"} />
        </button>
    )
}

export default memo(BarsIcon);
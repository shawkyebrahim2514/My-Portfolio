import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { memo, useCallback } from 'react';
import styles from './BarsIcon.module.css';

type BarsIconProps = {
    readonly setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function BarsIcon({ setIsMenuOpen }: BarsIconProps) {
    const clickHandler = useCallback(() => {
        setIsMenuOpen((oldIsMenuOpen) => !oldIsMenuOpen);
    }, [setIsMenuOpen]);
    const keyDownHandler = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            clickHandler();
        }
    }, [clickHandler]);

    return (
        <div
            className={styles.bars}
            role="button"
            tabIndex={0}
            aria-label="Open navigation menu"
            onClick={clickHandler}
            onKeyDown={keyDownHandler} >
            <FontAwesomeIcon icon={faBars} size={"xl"} />
        </div>
    )
}

export default memo(BarsIcon);
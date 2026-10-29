import { useEffect } from 'react';
import PortfolioLinks from '../../PortfolioLinks';
import BlurBackground from '../../../../BlurBackground';
import ExitButton from './ExitButton';
import { cx } from '../../../../../utils/cx';
import styles from './DropDownLinks.module.css';

type DropDownLinksProps = {
    readonly isMenuOpen: boolean;
    readonly onClose: () => void;
};

export default function DropDownLinks({ isMenuOpen, onClose }: DropDownLinksProps) {
    useEffect(() => {
        if (!isMenuOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isMenuOpen, onClose]);

    return (
        <div
            id="mobile-menu"
            className={cx(styles.overlay, isMenuOpen && styles.overlayOpen)}
            inert={!isMenuOpen}
        >
            <BlurBackground backgroundColor={'var(--color-base-400)'} />
            <ExitButton onClose={onClose} />
            <div className={styles.panel}>
                <PortfolioLinks linkButtonOnClickHandler={onClose} itemClassName={styles.pill} />
            </div>
        </div>
    );
}

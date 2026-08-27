import { useCallback } from 'react'
import { SanityNavbarData } from '../../Types';
import { navigate } from 'vike/client/router';
import styles from './Logo.module.css';

export default function Logo({ logo }: Readonly<Pick<SanityNavbarData, "logo">>) {
    const changeLinksHandler = useCallback(() => { void navigate('/'); }, []);

    return (
        <button
            type="button"
            className={styles.logo}
            onClick={changeLinksHandler}
            aria-label={`${logo}, go to About`}>
            <span className={styles.text}>{logo}</span>
        </button>
    )
}

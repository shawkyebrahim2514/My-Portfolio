import { useCallback } from 'react'
import Text from '../Text'
import { SanityNavbarData } from '../../Types';
import { useNavigate } from 'react-router-dom';
import styles from './Logo.module.css';

export default function Logo({ logo }: Readonly<Pick<SanityNavbarData, "logo">>) {
    const navigate = useNavigate();

    const changeLinksHandler = useCallback(() => navigate(''), [navigate]);

    return (
        <button
            type="button"
            className={styles.logo}
            onClick={changeLinksHandler}
            aria-label={`${logo}, go to About`}>
            <Text variant={"h2"}>
                <span className={styles.text}>{logo}</span>
            </Text>
        </button>
    )
}
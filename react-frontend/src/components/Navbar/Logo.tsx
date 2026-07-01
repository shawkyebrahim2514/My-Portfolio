import { useCallback } from 'react'
import Text from '../Text'
import { SanityNavbarData } from '../../Types';
import { useNavigate } from 'react-router-dom';
import styles from './Logo.module.css';

export default function Logo({ logo }: Readonly<Pick<SanityNavbarData, "logo">>) {
    const navigate = useNavigate();

    const changeLinksHandler = useCallback(() => navigate(''), [navigate]);
    const onKeyDownHandler = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            changeLinksHandler();
        }
    }, [changeLinksHandler]);

    return (
        <div
            className={styles.logo}
            role="button"
            tabIndex={0}
            onClick={changeLinksHandler}
            onKeyDown={onKeyDownHandler} >
            <Text variant={"h2"}>
                <span className={styles.text}>{logo}</span>
            </Text>
        </div>
    )
}
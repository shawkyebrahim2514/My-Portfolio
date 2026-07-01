import Logo from './Logo'
import Links from './Links';
import { SanityNavbarData } from '../../Types';
import { getNavbarData } from '../../APIs';
import Loader from '../Loader';
import { useSanityQuery } from '../../hooks/useSanityQuery';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { data: navbarData } = useSanityQuery<SanityNavbarData>(getNavbarData);

    return (
        <div className={styles.navbar}>
            <div className={styles.inner}>
                {navbarData ? <Logo logo={navbarData.logo} /> : <Loader />}
                <Links />
            </div>
        </div>
    )
}

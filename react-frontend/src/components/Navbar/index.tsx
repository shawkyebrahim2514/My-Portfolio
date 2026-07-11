import Logo from './Logo'
import Links from './Links';
import { SanityNavbarData } from '../../Types';
import { getNavbarData } from '../../APIs';
import Loader from '../Loader';
import { useSanityQuery } from '../../hooks/useSanityQuery';
import NavbarProgress from '../NavbarProgress';
import styles from './Navbar.module.css';

export default function Navbar({
    readingProgress = false,
    progressAccent,
}: Readonly<{ readingProgress?: boolean; progressAccent?: string }>) {
    const { data: navbarData } = useSanityQuery<SanityNavbarData>(getNavbarData);

    return (
        <nav className={styles.navbar} aria-label="Primary">
            <div className={styles.inner}>
                {navbarData ? <Logo logo={navbarData.logo} /> : <Loader />}
                <Links />
            </div>
            {readingProgress && <NavbarProgress accent={progressAccent} />}
        </nav>
    )
}

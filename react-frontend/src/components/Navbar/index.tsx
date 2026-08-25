import Logo from './Logo'
import Links from './Links';
import NavbarProgress from '../NavbarProgress';
import styles from './Navbar.module.css';

export default function Navbar({
    logo,
    readingProgress = false,
    progressAccent,
}: Readonly<{ logo: string; readingProgress?: boolean; progressAccent?: string }>) {
    return (
        <nav className={styles.navbar} aria-label="Primary">
            <div className={styles.inner}>
                <Logo logo={logo} />
                <Links />
            </div>
            {readingProgress && <NavbarProgress accent={progressAccent} />}
        </nav>
    )
}

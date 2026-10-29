import { SanityNavbarData } from '../../Types';
import styles from './Logo.module.css';

export default function Logo({ logo }: Readonly<Pick<SanityNavbarData, 'logo'>>) {
    return (
        <a href="/" className={styles.logo} aria-label={`${logo}, go to About`}>
            <span className={styles.text}>{logo}</span>
        </a>
    );
}

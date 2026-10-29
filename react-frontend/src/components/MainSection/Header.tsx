import Text from '../Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { cx } from '../../utils/cx';
import styles from './Header.module.css';

type HeaderProps = {
    readonly title: string;
    readonly link?: string;
    readonly subtitle?: string;
    readonly inline?: boolean;
};

export default function Header({ title, link, subtitle, inline = false }: HeaderProps) {
    const heading = (
        <Text variant={'h3'} as={inline ? 'span' : 'h2'} className={styles.titleText}>
            {link ? (
                <a
                    className={cx(styles.headerLink, styles.pointer)}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${title} (opens in new tab)`}
                >
                    <span className={styles.headerText}>{title}</span>
                    <span className={styles.linkText}>
                        <ExternalLinkIcon />
                    </span>
                </a>
            ) : (
                <span className={styles.headerText}>{title}</span>
            )}
        </Text>
    );
    if (inline) return heading;
    return (
        <>
            <div className={styles.headerContainer}>{heading}</div>
            {subtitle && <SubtitleText>{subtitle}</SubtitleText>}
        </>
    );
}

function ExternalLinkIcon() {
    return <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={'sm'} />;
}

function SubtitleText({ children }: { readonly children: React.ReactNode }) {
    return (
        <Text variant={'h4'} as="p">
            {children}
        </Text>
    );
}

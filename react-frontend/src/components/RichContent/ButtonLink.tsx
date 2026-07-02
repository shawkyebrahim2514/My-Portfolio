import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { cx } from '../../utils/cx';
import buttonStyles from '../Button/Button.module.css';
import styles from './ButtonLink.module.css';

type ButtonLinkProps = {
    readonly href: string;
    readonly icon?: 'link' | 'doc';
    readonly text: string;
    readonly size?: 'sm' | 'md' | 'lg';
};

// Renders `[[Text|doc]](url)` / `[[Text]](url)` button-links as a real
// anchor styled like Button, rather than a <button> driven by an onClick
// window.open — real link semantics are keyboard/middle-click/screen-reader
// friendly in a way a synthetic button never is.
export default function ButtonLink({ href, icon = 'link', text, size = 'md' }: ButtonLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cx(buttonStyles.button, buttonStyles[size], buttonStyles.pointer, styles.noUnderline)}
        >
            <FontAwesomeIcon icon={icon === 'doc' ? faFileAlt : faLink} />
            {text}
        </a>
    );
}

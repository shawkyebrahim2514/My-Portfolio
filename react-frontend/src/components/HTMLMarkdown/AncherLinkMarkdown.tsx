import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Button from '../Button';
import Header from '../MainSection/Header';
import type { Element } from 'hast'
import { faLink, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './AncherLinkMarkdown.module.css';

type AncherLinkMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLAnchorElement>;

type IconType = 'doc' | 'link';

const iconName: Record<IconType, IconDefinition> = {
    doc: faFileAlt,
    link: faLink,
}

const AncherLinkMarkdown = ({ node, ...props }: AncherLinkMarkdownProps) => {
    const title = props.children as string;
    const link = node?.properties?.href as string;
    // `[[Google|doc]](https://www.google.com)`
    const matchButtonLink = /\[([^|]+)(?:\|(doc|link))?\]/.exec(title);
    if (matchButtonLink) {
        const title = matchButtonLink[1];
        const icon = iconName[(matchButtonLink[2] as IconType) || 'link'];

        return (
            <Button
                icon={<FontAwesomeIcon icon={icon} />}
                text={title}
                size='md'
                onClick={() => { window.open(link, "_blank") }}
                pointer={true}
                className={styles.button}
            />
        )
    }
    // `[Google](https://www.google.com)`
    return (
        <Header
            title={title}
            link={link} />
    )
}

export default AncherLinkMarkdown
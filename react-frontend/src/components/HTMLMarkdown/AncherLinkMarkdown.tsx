import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Button';
import Header from '../MainSection/Header';
import type { Element } from 'hast'
import { faLink } from '@fortawesome/free-solid-svg-icons';

type AncherLinkMarkdownProps = {
    node?: Element,
} & React.HTMLAttributes<HTMLAnchorElement>;

const AncherLinkMarkdown = ({ node, ...props }: AncherLinkMarkdownProps) => {
    const title = props.children as string;
    const link = node?.properties?.href as string;
    // `[[Google]](https://www.google.com)`
    const matchButtonLink = /\[(.*)\]/.exec(title);
    if (matchButtonLink) {
        return (
            <Button
                icon={<FontAwesomeIcon icon={faLink} />}
                text={matchButtonLink[1]}
                size='md'
                onClick={() => { window.open(link, "_blank") }}
                pointer={true}
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
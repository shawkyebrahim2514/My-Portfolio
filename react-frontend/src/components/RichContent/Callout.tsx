import { PortableText } from '@portabletext/react';
import MainSection from '../MainSection';
import { cx } from '../../utils/cx';
import type { RichCallout } from '../../Types';
import { components } from './components';
import styles from './Callout.module.css';

type CalloutProps = {
    readonly value: RichCallout;
};

// Renders the `callout` block object — replaces the `> [!variation] Title`
// blockquote DSL. `style: 'popup'` is the one variant with structurally
// different markup (a MainSection headline/content wrapper instead of a
// colored bar), matching the old BlockquoteMarkdown behavior. Recurses
// through the SAME components map, since real content nests a "plain"
// callout inside a "popup" one for the title/body split.
export default function Callout({ value }: CalloutProps) {
    const body = <PortableText value={value.body} components={components} />;

    if (value.style === 'popup') {
        return <MainSection>{body}</MainSection>;
    }

    const isSecondary = value.color === 'secondary';
    return (
        <div
            className={cx(
                styles.blockquote,
                isSecondary ? styles.secondaryBar : styles.baseBar,
                value.style === 'highlight' && (isSecondary ? styles.highlightSecondary : styles.highlightBase),
            )}
        >
            <div className={styles.bar} />
            {body}
        </div>
    );
}

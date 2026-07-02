import type { PortableTextComponents } from '@portabletext/react';
import React from 'react';
import Button from '../Button';
import Header from '../MainSection/Header';
import ButtonLink from './ButtonLink';
import ImageRow from './ImageRow';
import Callout from './Callout';
import { cx } from '../../utils/cx';
import type { RichBlock, RichMarkDef } from '../../Types';
import { blockAlignClass } from './utils';
import styles from './RichContent.module.css';
import marksStyles from './Marks.module.css';

// A standalone `[Text](url)` / `[[Text|doc]](url)` link — optionally combined
// with a highlight decorator on the same span, e.g. `**!-[Title](url)-!**`
// used for popup-callout headings — is always the sole child of its own
// block (paragraph OR heading) in real content. Old customLink re-tagged the
// paragraph as a <div> so the block-level Header/ButtonLink wouldn't
// invalidly nest inside a <p> (headings can validly contain an <a>, so no
// re-tagging is needed there — see NormalBlock/makeHeading below). Either
// way we swap in Header/ButtonLink for the plain link markup; if a highlight
// decorator rode along on the same span we wrap the result in that
// decorator's class so the highlight styling (color/background) still
// applies — Header/ButtonLink already set `color: inherit`, so nesting them
// inside the highlight span reproduces the old look exactly.
const DECORATOR_MARK_CLASS: Record<string, string | undefined> = {
    strong: marksStyles.highlightTextBase,
    highlightSecondary: marksStyles.highlightTextSecondary,
    highlightAreaBase: marksStyles.highlightAreaBase,
    highlightAreaSecondary: marksStyles.highlightAreaSecondary,
};

function singleLinkOverride(value: RichBlock): React.ReactNode | undefined {
    if (value.children.length !== 1) return undefined;
    const child = value.children[0];
    if (child._type !== 'span') return undefined;
    const marks = child.marks ?? [];
    const def: RichMarkDef | undefined = value.markDefs?.find((d) => marks.includes(d._key));
    if (!def) return undefined;
    const content =
        def._type === 'link' ? (
            <Header title={child.text} link={def.href} />
        ) : (
            <ButtonLink href={def.href} icon={def.icon} text={child.text} />
        );
    const decoratorMark = marks.find((m) => DECORATOR_MARK_CLASS[m]);
    return decoratorMark ? <span className={DECORATOR_MARK_CLASS[decoratorMark]}>{content}</span> : content;
}

// Block-level serializer props carry the raw block JSON (`value`) plus the
// already-rendered children — cast to our concrete schema shape (`RichBlock`)
// rather than fighting the library's generic/loosely-typed default block
// shape via explicit prop annotations (which trips TS variance checks).
type BlockProps = { value: unknown; children?: React.ReactNode };

function NormalBlock({ value, children }: BlockProps) {
    const block = value as RichBlock;
    const alignClass = blockAlignClass(block.children, styles);
    const override = singleLinkOverride(block);
    if (override) return alignClass ? <div className={alignClass}>{override}</div> : override;
    return <p className={alignClass}>{children}</p>;
}

function makeHeading(tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', styleKey: keyof typeof styles) {
    return function Heading({ value, children }: BlockProps) {
        const block = value as RichBlock;
        const override = singleLinkOverride(block);
        return React.createElement(
            tag,
            { className: cx(styles[styleKey], blockAlignClass(block.children, styles)) },
            override ?? children,
        );
    };
}

export const components: PortableTextComponents = {
    block: {
        normal: NormalBlock,
        h1: makeHeading('h1', 'h1'),
        h2: makeHeading('h2', 'h2'),
        h3: makeHeading('h3', 'h3'),
        h4: makeHeading('h4', 'h4'),
        h5: makeHeading('h5', 'h5'),
        h6: makeHeading('h6', 'h6'),
    },
    list: {
        bullet: ({ children }) => <ul className={styles.ul}>{children}</ul>,
    },
    listItem: {
        bullet: ({ children }) => <li className={styles.li}>{children}</li>,
    },
    marks: {
        strong: ({ children }) => <strong className={marksStyles.highlightTextBase}>{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => <code>{children}</code>,
        highlightSecondary: ({ children }) => <span className={marksStyles.highlightTextSecondary}>{children}</span>,
        highlightAreaBase: ({ children }) => <span className={marksStyles.highlightAreaBase}>{children}</span>,
        highlightAreaSecondary: ({ children }) => (
            <span className={marksStyles.highlightAreaSecondary}>{children}</span>
        ),
        // `[[Text]]` badge — a Button-shaped decoration with no interaction.
        buttonBadge: ({ children }) => (
            <Button size="sm" className={marksStyles.badge}>
                {children}
            </Button>
        ),
        // Block-wide alignment is applied span-by-span (see richContent.ts);
        // the block wrapper reads it back off `value.children` — the mark
        // itself renders nothing extra here.
        alignLeft: ({ children }) => <>{children}</>,
        alignCenter: ({ children }) => <>{children}</>,
        alignRight: ({ children }) => <>{children}</>,
        // Inline fallback for a link embedded alongside other text — real
        // standalone links are handled by `singleLinkOverride` above instead.
        link: ({ value, text }) => (
            <a href={value?.href} className={marksStyles.inlineLink}>
                {text}
            </a>
        ),
        buttonLink: ({ value, text }) => (
            <ButtonLink href={value?.href} icon={value?.icon} text={text} size="sm" />
        ),
    },
    types: {
        imageRow: ImageRow,
        callout: Callout,
        divider: () => <hr className={styles.hr} />,
        spacer: ({ value }) => (
            <span className={value.kind === 'newline' ? styles.newline : styles.gap} />
        ),
    },
};

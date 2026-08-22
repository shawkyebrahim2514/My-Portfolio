import { useMemo } from 'react';
import { PortableText } from '@portabletext/react';
import type { RichContentNode, RichFacebookResource, RichLinkPreview } from '../../Types';
import { components, createComponents } from './components';
import LinkPreview from './LinkPreview';
import FacebookResource from './FacebookResource';
import styles from './RichContent.module.css';

type RichContentProps = {
    readonly value: RichContentNode[];
    // Optional map of heading block `_key` → anchor id. Supplied by article
    // entries so the rendered headings carry ids the "On this page" TOC can
    // link to and scroll-spy against. Omitted everywhere else.
    readonly headingIds?: Record<string, string>;
};

// Renders a Sanity Portable Text field (see sanity-backend/schemas/objects/
// richContent.ts) — replaces the old hand-rolled bracket-DSL markdown
// pipeline (react-markdown + customPlugins/*). Every custom mark/block
// object maps 1:1 to a serializer in ./components.
function RichContent({ value, headingIds }: RichContentProps) {
    const cmps = useMemo(
        () => (headingIds ? createComponents(headingIds) : components),
        [headingIds],
    );
    const groups = useMemo(() => {
        const result: RichContentNode[][] = [];
        for (const node of value) {
            const previous = result.at(-1);
            const groupType =
                node._type === 'linkPreview' || node._type === 'facebookResource'
                    ? node._type
                    : 'portableText';
            const previousType =
                previous?.[0]?._type === 'linkPreview' ||
                previous?.[0]?._type === 'facebookResource'
                    ? previous[0]._type
                    : 'portableText';
            if (previous && groupType === previousType) {
                previous.push(node);
            } else {
                result.push([node]);
            }
        }
        return result;
    }, [value]);

    return groups.map((group) => {
        const first = group[0];
        if (first._type === 'linkPreview') {
            return (
                <div className={styles.linkPreviewGrid} key={first._key}>
                    {(group as RichLinkPreview[]).map((link) => (
                        <LinkPreview key={link._key} value={link} compact />
                    ))}
                </div>
            );
        }
        if (first._type === 'facebookResource') {
            return (
                <div className={styles.facebookResourceGrid} key={first._key}>
                    {(group as RichFacebookResource[]).map((resource) => (
                        <FacebookResource key={resource._key} value={resource} />
                    ))}
                </div>
            );
        }
        return <PortableText key={first._key} value={group} components={cmps} />;
    });
}

export default RichContent;

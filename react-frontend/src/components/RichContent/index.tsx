import { useMemo } from 'react';
import { PortableText } from '@portabletext/react';
import type { RichContentNode } from '../../Types';
import { components, createComponents } from './components';

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
    return <PortableText value={value} components={cmps} />;
}

export default RichContent;

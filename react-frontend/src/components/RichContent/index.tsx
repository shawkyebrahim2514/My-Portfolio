import { PortableText } from '@portabletext/react';
import type { RichContentNode } from '../../Types';
import { components } from './components';

type RichContentProps = {
    readonly value: RichContentNode[];
};

// Renders a Sanity Portable Text field (see sanity-backend/schemas/objects/
// richContent.ts) — replaces the old hand-rolled bracket-DSL markdown
// pipeline (react-markdown + customPlugins/*). Every custom mark/block
// object maps 1:1 to a serializer in ./components.
function RichContent({ value }: RichContentProps) {
    return <PortableText value={value} components={components} />;
}

export default RichContent;

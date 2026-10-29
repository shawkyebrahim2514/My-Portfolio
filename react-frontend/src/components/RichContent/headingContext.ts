import { createContext } from 'react';

type HeadingContextValue = {
    tags: Readonly<Record<string, string>>;
    as?: 'p';
};

export const HeadingContext = createContext<HeadingContextValue>({ tags: {} });

export function headingTags(value: unknown, firstLevel: 1 | 2 | 3): Record<string, string> {
    const styles = new Set<string>();
    const visit = (node: unknown) => {
        if (!node || typeof node !== 'object') return;
        if (
            '_type' in node &&
            node._type === 'block' &&
            'style' in node &&
            typeof node.style === 'string' &&
            /^h[1-6]$/.test(node.style)
        ) {
            styles.add(node.style);
        }
        Object.values(node).forEach(visit);
    };
    visit(value);
    return Object.fromEntries(
        [...styles].sort().map((style, index) => [style, `h${Math.min(6, firstLevel + index)}`])
    );
}

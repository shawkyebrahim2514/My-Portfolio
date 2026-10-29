import { lazy, Suspense } from 'react';
import type { RichCode } from '../../Types';

// Prerendering uses renderToString, which cannot await a cold lazy boundary.
const CodeBlock = import.meta.env.SSR
    ? (await import('./CodeBlock')).default
    : lazy(() => import('./CodeBlock'));

export default function DeferredCodeBlock({ value }: { readonly value: RichCode }) {
    return (
        <Suspense
            fallback={
                <pre dir="ltr" style={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <code>{value.code}</code>
                </pre>
            }
        >
            <CodeBlock value={value} />
        </Suspense>
    );
}

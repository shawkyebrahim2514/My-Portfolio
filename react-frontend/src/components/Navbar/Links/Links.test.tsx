import { act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import Links from './index';

const { viewport } = vi.hoisted(() => ({ viewport: { mobile: false } }));

vi.mock('react-responsive', () => ({
    useMediaQuery: () => viewport.mobile,
}));

vi.mock('vike-react/usePageContext', () => ({
    usePageContext: () => ({ urlPathname: '/' }),
}));

describe('Responsive navigation', () => {
    it('hydrates desktop prerendered markup at a mobile viewport without replacing it', async () => {
        viewport.mobile = false;
        const container = document.createElement('div');
        container.innerHTML = renderToString(<Links />);
        document.body.append(container);
        const aboutLink = container.querySelector('a[href="/"]');
        const onRecoverableError = vi.fn();

        viewport.mobile = true;
        let root: ReturnType<typeof hydrateRoot> | undefined;
        try {
            await act(async () => {
                root = hydrateRoot(container, <Links />, { onRecoverableError });
            });

            expect(onRecoverableError).not.toHaveBeenCalled();
            expect(container.querySelector('a[href="/"]')).toBe(aboutLink);
        } finally {
            await act(async () => root?.unmount());
            container.remove();
        }
    });
});

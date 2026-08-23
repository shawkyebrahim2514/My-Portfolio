import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';

vi.mock('react-responsive', () => ({
    useMediaQuery: () => false,
}));

vi.mock('vike/client/router', () => ({
    navigate: vi.fn(),
}));

const { usePageContext } = vi.hoisted(() => ({ usePageContext: vi.fn() }));
vi.mock('vike-react/usePageContext', () => ({ usePageContext }));

import Navbar from './index';

function renderNavbar(initialPath = '/') {
    usePageContext.mockReturnValue({ urlPathname: initialPath });
    return render(<Navbar logo="SE" />);
}

describe('Navbar — accessibility', () => {
    it('exposes a navigation landmark with an accessible name', () => {
        const { container } = renderNavbar();
        const nav = container.querySelector('nav');
        expect(nav).not.toBeNull();
        expect(nav).toHaveAttribute('aria-label', 'Primary');
    });

    it('renders page navigation as real anchor links', () => {
        const { container } = renderNavbar();
        const links = container.querySelectorAll('nav a[href]');
        expect(links.length).toBeGreaterThanOrEqual(6);
    });

    it('marks the active page link with aria-current="page"', () => {
        const { container } = renderNavbar('/skills');
        const current = container.querySelector('nav a[aria-current="page"]');
        expect(current).not.toBeNull();
        expect(current?.textContent).toBe('Skills');
    });

    it('has no axe violations', async () => {
        const { container } = renderNavbar();
        expect(await axe(container)).toHaveNoViolations();
    });
});

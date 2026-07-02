import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';

vi.mock('../../hooks/useSanityQuery', () => ({
    useSanityQuery: () => ({ data: { logo: 'SE' }, loading: false, error: null }),
}));

vi.mock('react-responsive', () => ({
    useMediaQuery: () => false,
}));

import Navbar from './index';

function renderNavbar(initialPath = '/') {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Navbar />
        </MemoryRouter>
    );
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

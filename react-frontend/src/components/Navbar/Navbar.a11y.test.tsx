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

function renderNavbar() {
    return render(
        <MemoryRouter>
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

    it('has no axe violations', async () => {
        const { container } = renderNavbar();
        expect(await axe(container)).toHaveNoViolations();
    });
});

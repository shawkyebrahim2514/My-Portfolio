import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import Content from './Content';

const contacts = [
    { name: 'GitHub', imgSrc: '/gh.png', link: 'https://github.com/x' },
    { name: 'LinkedIn', imgSrc: '/li.png', link: 'https://linkedin.com/in/x' },
];

describe('Contacts — accessibility', () => {
    it('renders each contact as a real external anchor with safe rel', () => {
        const { container } = render(<Content contacts={contacts} />);
        const links = container.querySelectorAll('a[href]');
        expect(links).toHaveLength(2);
        links.forEach((a) => {
            expect(a).toHaveAttribute('target', '_blank');
            expect(a.getAttribute('rel')).toContain('noopener');
        });
    });

    it('names each link and flags that it opens in a new tab', () => {
        const { container } = render(<Content contacts={contacts} />);
        const first = container.querySelector('a[href]');
        expect(first?.getAttribute('aria-label')).toBe('GitHub (opens in new tab)');
    });

    it('marks the contact image as decorative (label comes from the link)', () => {
        const { container } = render(<Content contacts={contacts} />);
        const img = container.querySelector('a[href] img');
        expect(img?.getAttribute('alt')).toBe('');
    });

    it('has no axe violations', async () => {
        const { container } = render(<Content contacts={contacts} />);
        expect(await axe(container)).toHaveNoViolations();
    });
});

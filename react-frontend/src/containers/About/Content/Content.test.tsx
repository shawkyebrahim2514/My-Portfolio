import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Content from './index';

describe('Homepage actions', () => {
    it('puts the resume first, followed by experience and contact native links', () => {
        render(
            <Content
                description={[]}
                showActions
                resume={{ link: 'https://example.com/resume', text: 'Read my resume' }}
            />
        );
        const actions = within(screen.getByRole('navigation', { name: 'Portfolio actions' }));
        expect(actions.getByRole('link', { name: 'Explore my experience' })).toHaveAttribute(
            'href',
            '/experience'
        );
        expect(actions.getByRole('link', { name: 'Get in touch' })).toHaveAttribute(
            'href',
            '/contacts'
        );
        expect(actions.getByRole('link', { name: 'See my resume' })).toHaveAttribute(
            'href',
            'https://example.com/resume'
        );
        expect(actions.getAllByRole('link').map((link) => link.textContent)).toEqual([
            'See my resume',
            'Explore my experience',
            'Get in touch',
        ]);
    });

    it('omits the resume action when no resume is configured', () => {
        render(<Content description={[]} showActions />);
        expect(within(screen.getByRole('navigation')).getAllByRole('link')).toHaveLength(2);
        expect(within(screen.getByRole('navigation')).getAllByRole('link')[0]).toHaveAttribute(
            'href',
            '/experience'
        );
    });

    it('does not repeat the hero actions in the biography', () => {
        render(<Content description={[]} />);
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
});

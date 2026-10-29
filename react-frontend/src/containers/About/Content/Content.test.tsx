import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Content from './index';

describe('Homepage actions', () => {
    it('provides native project, resume and contact links', () => {
        render(
            <Content
                description={[]}
                showActions
                resume={{ link: 'https://example.com/resume', text: 'Read my resume' }}
            />
        );
        const actions = within(screen.getByRole('navigation', { name: 'Portfolio actions' }));
        expect(actions.getByRole('link', { name: 'Explore projects' })).toHaveAttribute(
            'href',
            '/projects'
        );
        expect(actions.getByRole('link', { name: 'Get in touch' })).toHaveAttribute(
            'href',
            '/contacts'
        );
        expect(actions.getByRole('link', { name: 'Read my resume' })).toHaveAttribute(
            'href',
            'https://example.com/resume'
        );
    });

    it('omits the resume action when no resume is configured', () => {
        render(<Content description={[]} showActions />);
        expect(within(screen.getByRole('navigation')).getAllByRole('link')).toHaveLength(2);
    });

    it('does not repeat the hero actions in the biography', () => {
        render(<Content description={[]} />);
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
});

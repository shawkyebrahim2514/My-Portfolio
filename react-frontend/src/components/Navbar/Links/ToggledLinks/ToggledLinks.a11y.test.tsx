import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ToggledLinks from './index';

vi.mock('vike-react/usePageContext', () => ({
    usePageContext: () => ({ urlPathname: '/' }),
}));

function renderMenu() {
    return render(<ToggledLinks />);
}

describe('ToggledLinks — mobile menu accessibility', () => {
    it('toggle button reports collapsed state and controls the menu', () => {
        const { container } = renderMenu();
        const toggle = container.querySelector('button[aria-controls="mobile-menu"]');
        expect(toggle).not.toBeNull();
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('menu is inert while closed and interactive once opened', () => {
        const { container } = renderMenu();
        const menu = container.querySelector('#mobile-menu');
        const toggle = container.querySelector(
            'button[aria-controls="mobile-menu"]'
        ) as HTMLButtonElement;

        expect(menu?.hasAttribute('inert')).toBe(true);

        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(menu?.hasAttribute('inert')).toBe(false);
    });

    it('closes on Escape and returns focus from the hidden panel to the toggle', () => {
        const { container } = renderMenu();
        const toggle = container.querySelector(
            'button[aria-controls="mobile-menu"]'
        ) as HTMLButtonElement;

        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        const close = container.querySelector<HTMLButtonElement>('#mobile-menu button');
        if (!close) throw new Error('Navigation close button is missing');
        close.focus();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(toggle).toHaveFocus();
    });

    it('returns focus to the toggle when the panel close button is used', () => {
        const { container } = renderMenu();
        const toggle = container.querySelector<HTMLButtonElement>(
            'button[aria-controls="mobile-menu"]'
        );
        const close = container.querySelector<HTMLButtonElement>('#mobile-menu button');
        if (!toggle || !close) throw new Error('Navigation controls are missing');

        fireEvent.click(toggle);
        close.focus();
        fireEvent.click(close);

        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(toggle).toHaveFocus();
    });
});

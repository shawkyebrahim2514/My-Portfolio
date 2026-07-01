import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './index';

describe('Button', () => {
    it('renders the provided text', () => {
        render(<Button text="Click me" />);
        expect(
            screen.getByRole('button', { name: 'Click me' })
        ).toBeInTheDocument();
    });

    it('renders children', () => {
        render(<Button>Child content</Button>);
        expect(
            screen.getByRole('button', { name: 'Child content' })
        ).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const onClick = vi.fn();
        render(<Button text="Press" onClick={onClick} />);
        await userEvent.click(screen.getByRole('button', { name: 'Press' }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is a native button element with type="button"', () => {
        render(<Button text="Native" />);
        expect(screen.getByRole('button', { name: 'Native' })).toHaveAttribute(
            'type',
            'button'
        );
    });
});

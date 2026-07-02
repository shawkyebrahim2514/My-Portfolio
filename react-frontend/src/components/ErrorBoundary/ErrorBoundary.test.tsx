import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundary from './index';

function Boom(): React.JSX.Element {
    throw new Error('boom');
}

describe('ErrorBoundary', () => {
    beforeEach(() => {
        // Silence the expected React error log for the thrown error.
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <p>Safe content</p>
            </ErrorBoundary>
        );
        expect(screen.getByText('Safe content')).toBeInTheDocument();
    });

    it('renders the default fallback alert when a child throws', () => {
        render(
            <ErrorBoundary>
                <Boom />
            </ErrorBoundary>
        );
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent(/something went wrong/i);
    });

    it('renders a custom fallback when provided', () => {
        render(
            <ErrorBoundary fallback={<p>Custom fallback</p>}>
                <Boom />
            </ErrorBoundary>
        );
        expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import Button from './index';

describe('Button — accessibility', () => {
    it('has no axe violations', async () => {
        const { container } = render(<Button text="Click me" />);
        expect(await axe(container)).toHaveNoViolations();
    });
});

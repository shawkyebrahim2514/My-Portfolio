import { describe, it, expect } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
    it('joins truthy class strings with a single space', () => {
        expect(cx('a', 'b', 'c')).toBe('a b c');
    });

    it('drops falsy values (false, null, undefined, empty string)', () => {
        expect(cx('a', false, null, undefined, '', 'b')).toBe('a b');
    });

    it('supports conditional expressions', () => {
        const active = true;
        const disabled = false;
        expect(cx('base', active && 'active', disabled && 'disabled')).toBe(
            'base active'
        );
    });

    it('returns an empty string when nothing is truthy', () => {
        expect(cx(false, null, undefined, '')).toBe('');
    });
});

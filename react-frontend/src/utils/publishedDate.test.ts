import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatPublishedDate } from './publishedDate';

afterEach(() => vi.unstubAllEnvs());

describe('Publication dates', () => {
    it.each(['UTC', 'Africa/Cairo', 'America/Los_Angeles', 'Pacific/Auckland'])(
        'preserves the UTC publication day in both content languages when the reader is in %s',
        (timeZone) => {
            vi.stubEnv('TZ', timeZone);
            expect(formatPublishedDate('2026-07-04T22:30:00Z', 'en')).toBe('July 4, 2026');
            expect(formatPublishedDate('2026-07-04T22:30:00Z', 'ar')).toBe('٤ يوليو ٢٠٢٦');
            expect(formatPublishedDate('2026-01-01T00:30:00Z', 'en')).toBe('January 1, 2026');
        }
    );
});

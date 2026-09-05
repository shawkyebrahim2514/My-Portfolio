import {afterEach, describe, expect, it} from 'vitest';
import {isAllowedStudioOrigin} from './_studio-origin';

const originalOrigins = process.env.SANITY_STUDIO_ORIGIN;

afterEach(() => {
    if (originalOrigins === undefined) delete process.env.SANITY_STUDIO_ORIGIN;
    else process.env.SANITY_STUDIO_ORIGIN = originalOrigins;
});

describe('isAllowedStudioOrigin', () => {
    it('accepts localhost Studio origins', () => {
        expect(isAllowedStudioOrigin('http://localhost:3333')).toBe(true);
    });

    it('accepts each configured comma-separated origin', () => {
        process.env.SANITY_STUDIO_ORIGIN = 'https://one.example, https://two.example';
        expect(isAllowedStudioOrigin('https://one.example')).toBe(true);
        expect(isAllowedStudioOrigin('https://two.example')).toBe(true);
    });

    it('rejects unconfigured and missing origins by default', () => {
        expect(isAllowedStudioOrigin('https://attacker.example')).toBe(false);
        expect(isAllowedStudioOrigin(undefined)).toBe(false);
        expect(isAllowedStudioOrigin(undefined, {allowMissing: true})).toBe(true);
    });
});

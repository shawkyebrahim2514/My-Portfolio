import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

expect.extend(axeMatchers);

// jsdom doesn't implement matchMedia. Several components use react-spring's
// useReducedMotion (window.matchMedia('(prefers-reduced-motion: reduce)')),
// so provide a minimal stub — tests always see "no preference" (matches: false).
if (typeof window.matchMedia !== 'function') {
    window.matchMedia = (query: string): MediaQueryList =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }) as MediaQueryList;
}

// jsdom also doesn't implement ResizeObserver (used by ShapeGridBackground/
// LogoLoop/ClickSpark-style canvas components to track their container size).
// A no-op stub is enough for component tests that don't assert on resize
// behavior — real resize logic is only meaningful in an actual browser.
if (typeof window.ResizeObserver !== 'function') {
    class ResizeObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

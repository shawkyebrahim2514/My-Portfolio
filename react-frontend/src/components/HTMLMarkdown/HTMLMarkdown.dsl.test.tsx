import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import HTMLMarkdown from './index';

const renderMd = (markdown: string) =>
    render(<HTMLMarkdown markdown={markdown} />).container;

describe('HTMLMarkdown — custom DSL', () => {
    it('[[text]] renders a button with the label', () => {
        const c = renderMd('[[Click Me]]');
        const btn = c.querySelector('button');
        expect(btn).not.toBeNull();
        expect(btn?.textContent).toBe('Click Me');
    });

    it('[gap] renders an inline <span> spacer, never a nested <p>', () => {
        const c = renderMd('left[gap]right');
        expect(c.querySelector('span')).not.toBeNull();
        expect(c.querySelector('p p')).toBeNull();
    });

    it('[newline] renders an inline <span> spacer, never a nested <p>', () => {
        const c = renderMd('top[newline]bottom');
        expect(c.querySelector('span')).not.toBeNull();
        expect(c.querySelector('p p')).toBeNull();
    });

    it('[center] applies text-align to the block', () => {
        const c = renderMd('[center]hello');
        expect(c.querySelector('[style*="text-align: center"]')).not.toBeNull();
    });

    it('# heading renders an <h1> with the heading style', () => {
        const c = renderMd('# My Title');
        const h1 = c.querySelector('h1');
        expect(h1?.textContent).toBe('My Title');
        expect(h1?.className).toMatch(/h1/);
    });

    it('- list renders custom <li> items', () => {
        const c = renderMd('- first\n- second');
        const items = c.querySelectorAll('li');
        expect(items).toHaveLength(2);
        expect(items[0].textContent).toBe('first');
    });

    it('**!text!** renders a secondary highlighted text span', () => {
        const c = renderMd('**!hot!**');
        const span = c.querySelector('[class*="highlightTextSecondary"]');
        expect(span).not.toBeNull();
        expect(span?.textContent).toBe('hot');
    });

    it('**-area-** renders a base highlight-area span', () => {
        const c = renderMd('**-area-**');
        const span = c.querySelector('[class*="highlightAreaBase"]');
        expect(span).not.toBeNull();
        expect(span?.textContent).toBe('area');
    });

    it('**!-area-!** renders a secondary highlight-area span', () => {
        const c = renderMd('**!-wow-!**');
        const span = c.querySelector('[class*="highlightAreaSecondary"]');
        expect(span).not.toBeNull();
        expect(span?.textContent).toBe('wow');
    });

    it('> [!variation] title blockquote renders title and body', () => {
        const c = renderMd('> [!note] Heads up\n> body text');
        expect(c.querySelector('[class*="blockquote"]')).not.toBeNull();
        expect(c.textContent).toContain('Heads up');
        expect(c.textContent).toContain('body text');
    });

    it('[[label|link]](url) renders a button with an icon', () => {
        const c = renderMd('[[Google|link]](https://google.com)');
        const btn = c.querySelector('button');
        expect(btn?.textContent).toContain('Google');
        expect(btn?.querySelector('svg')).not.toBeNull();
    });
});

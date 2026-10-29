import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';

export const clientDirectory = join(process.cwd(), 'dist', 'client');
export const budgets = { css: 20 * 1024, homeJs: 230 * 1024 };

export function pageDocument(route) {
    return new JSDOM(readFileSync(join(clientDirectory, route, 'index.html'), 'utf8')).window
        .document;
}

export function assetBytes(urls) {
    return [...new Set(urls)].reduce((bytes, url) => {
        const pathname = new URL(url, 'http://localhost').pathname;
        assert.ok(pathname.startsWith('/assets/'), `Unexpected asset path: ${pathname}`);
        return bytes + gzipSync(readFileSync(join(clientDirectory, ...pathname.split('/')))).length;
    }, 0);
}

for (const route of [
    '',
    'skills',
    'education',
    'experience',
    'projects',
    'contacts',
    'hub',
    'hub/follows',
    'hub/library',
    'hub/mataa3',
]) {
    const document = pageDocument(route);
    const headings = [
        ...document.querySelectorAll('main h1,main h2,main h3,main h4,main h5,main h6'),
    ];
    assert.equal(
        headings.filter((heading) => heading.tagName === 'H1').length,
        1,
        `${route || 'home'}: one H1`
    );
    let previous = 0;
    for (const heading of headings) {
        const level = Number(heading.tagName[1]);
        assert.ok(
            level <= previous + 1,
            `${route}: skipped heading level before "${heading.textContent}"`
        );
        assert.equal(heading.querySelector('h1,h2,h3,h4,h5,h6'), null, `${route}: nested heading`);
        previous = level;
    }
    console.log(`PASS prerendered heading outline: /${route}`);
}

const stylesheets = [...pageDocument('').querySelectorAll('link[rel="stylesheet"]')]
    .map((link) => link.getAttribute('href'))
    .filter((href) => href.startsWith('/assets/'));
assert.equal(stylesheets.length, 1, 'Home should request one bundled site stylesheet');
const cssBytes = assetBytes(stylesheets);
assert.ok(cssBytes <= budgets.css, `Site CSS ${cssBytes} exceeds ${budgets.css} gzip bytes`);
console.log(`PASS site CSS budget: ${cssBytes}/${budgets.css} gzip bytes`);

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { assetBytes, budgets, pageDocument } from './check-build.mjs';

const base = 'http://127.0.0.1:4175';
const vercelAnalytics = `${base}/_vercel/insights/script.js`;
const executable =
    process.env.CHROME_BIN ||
    (process.platform === 'win32'
        ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
        : '/usr/bin/google-chrome');
await access(executable);
const profile = await mkdtemp(join(tmpdir(), 'portfolio-browser-'));
const children = [];
let socket;
let sequence = 0;
const pending = new Map();
const listeners = new Set();
const launchErrors = [];
const diagnostics = [];

function launch(command, args) {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    child.on('error', (error) => launchErrors.push(error));
    for (const stream of [child.stdout, child.stderr]) {
        stream.on('data', (data) => {
            diagnostics.push(data.toString());
            if (diagnostics.length > 30) diagnostics.shift();
        });
    }
    children.push(child);
    return child;
}

function send(method, params = {}, sessionId) {
    const id = ++sequence;
    return new Promise((resolveRequest, reject) => {
        const timer = setTimeout(() => {
            pending.delete(id);
            reject(new Error(`CDP timeout: ${method}`));
        }, 15000);
        pending.set(id, { resolve: resolveRequest, reject, timer });
        socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
}

async function evaluate(sessionId, expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true }, sessionId);
    assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
}

async function waitFor(sessionId, expression) {
    for (let attempt = 0; attempt < 100; attempt++) {
        if (await evaluate(sessionId, `Boolean(${expression})`)) return;
        await sleep(150);
    }
    throw new Error(`Browser condition timed out: ${expression}`);
}

async function key(sessionId, name, keyCode) {
    for (const type of ['keyDown', 'keyUp']) {
        await send(
            'Input.dispatchKeyEvent',
            {
                type,
                key: name,
                code: name,
                windowsVirtualKeyCode: keyCode,
                ...(type === 'keyDown' && name === 'Enter' ? { text: '\r' } : {}),
            },
            sessionId
        );
    }
}

try {
    launch(process.execPath, [
        resolve('node_modules', 'vike', 'bin.js'),
        'preview',
        '--host',
        '127.0.0.1',
        '--port',
        '4175',
        '--strictPort',
    ]);
    launch(executable, [
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--remote-debugging-port=0',
        `--user-data-dir=${profile}`,
        'about:blank',
    ]);
    let endpoint;
    for (let attempt = 0; attempt < 150; attempt++) {
        if (launchErrors.length) throw launchErrors[0];
        assert.ok(
            children.every((child) => child.exitCode === null),
            diagnostics.join('')
        );
        try {
            const [port, route] = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8'))
                .trim()
                .split(/\r?\n/);
            const response = await fetch(base);
            if (response.ok) {
                endpoint = `ws://127.0.0.1:${port}${route}`;
                break;
            }
        } catch (error) {
            if (
                !['ENOENT', 'EBUSY'].includes(error.code) &&
                !(
                    error instanceof TypeError &&
                    ['ECONNREFUSED', 'ECONNRESET'].includes(error.cause?.code)
                )
            )
                throw error;
        }
        await sleep(100);
    }
    assert.ok(endpoint, `Preview/browser did not become ready:\n${diagnostics.join('')}`);
    console.log(
        'Local preview does not serve Vercel analytics; only that platform endpoint is excluded.'
    );
    socket = new WebSocket(endpoint);
    await once(socket, 'open');
    socket.addEventListener('message', ({ data }) => {
        const message = JSON.parse(data);
        if (message.id) {
            const request = pending.get(message.id);
            if (!request) return;
            clearTimeout(request.timer);
            pending.delete(message.id);
            if (message.error) request.reject(new Error(JSON.stringify(message.error)));
            else request.resolve(message.result);
        } else {
            for (const listener of listeners) listener(message);
        }
    });

    for (const scenario of [
        { route: '', desktop: true },
        { route: '' },
        { route: '', nojs: true },
        { route: 'hub' },
        { route: 'hub', width: 320 },
        { route: 'hub/follows', nojs: true },
        { route: 'hub/library', nojs: true },
        { route: 'experience' },
        { route: 'projects' },
        { route: 'hub/mataa3' },
        { route: 'hub/my-terminal-and-editor-setup-2026' },
        { route: 'hub/my-terminal-and-editor-setup-2026', nojs: true },
        { route: '', reduced: true },
    ]) {
        const label = `/${scenario.route} ${scenario.nojs ? 'no-JS' : 'JS'}${scenario.reduced ? ' reduced-motion' : ''}`;
        const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
        const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
        await send('Target.activateTarget', { targetId });
        const errors = [];
        const requests = new Map();
        const listener = (message) => {
            if (message.sessionId !== sessionId) return;
            const p = message.params;
            if (message.method === 'Runtime.exceptionThrown') errors.push(p.exceptionDetails);
            if (message.method === 'Network.requestWillBeSent')
                requests.set(p.requestId, { url: p.request.url, type: p.type });
            const request = requests.get(p.requestId);
            if (request?.url === vercelAnalytics) return;
            if (
                request?.url.startsWith(`${base}/`) &&
                ['Script', 'Stylesheet'].includes(request.type)
            ) {
                if (
                    message.method === 'Network.loadingFailed' &&
                    !(scenario.nojs && request.type === 'Script')
                )
                    errors.push(`${request.url}: ${p.errorText}`);
                if (message.method === 'Network.responseReceived' && p.response.status >= 400) {
                    errors.push(`${request.url}: HTTP ${p.response.status}`);
                }
            }
        };
        listeners.add(listener);
        for (const domain of ['Page', 'Runtime', 'Network'])
            await send(`${domain}.enable`, {}, sessionId);
        await send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId);
        await send(
            'Emulation.setDeviceMetricsOverride',
            {
                width: scenario.desktop ? 1440 : scenario.width || 390,
                height: 844,
                deviceScaleFactor: 1,
                mobile: !scenario.desktop,
            },
            sessionId
        );
        await send(
            'Emulation.setEmulatedMedia',
            {
                features: [
                    {
                        name: 'prefers-reduced-motion',
                        value: scenario.reduced ? 'reduce' : 'no-preference',
                    },
                ],
            },
            sessionId
        );
        await send('Emulation.setTimezoneOverride', { timezoneId: 'Pacific/Auckland' }, sessionId);
        await send(
            'Page.addScriptToEvaluateOnNewDocument',
            {
                source: `
            window.__draws = { spark: 0, grid: 0 };
            const original = CanvasRenderingContext2D.prototype.clearRect;
            CanvasRenderingContext2D.prototype.clearRect = function(...args) {
                const z = getComputedStyle(this.canvas).zIndex;
                if (z === '9999') window.__draws.spark++;
                if (z === '-1') window.__draws.grid++;
                return original.apply(this, args);
            };
        `,
            },
            sessionId
        );
        if (scenario.nojs)
            await send('Emulation.setScriptExecutionDisabled', { value: true }, sessionId);
        await send('Page.navigate', { url: `${base}/${scenario.route}` }, sessionId);
        await waitFor(
            sessionId,
            `document.readyState !== 'loading' && document.querySelector('main') &&
            [...document.styleSheets].some(sheet => sheet.href?.startsWith(location.origin))`
        );

        if (!scenario.nojs && !scenario.desktop) {
            await waitFor(
                sessionId,
                `document.querySelector('header [data-enhanced="true"] button[aria-controls="mobile-menu"]')`
            );
            // Exercise a native keyboard click, rather than only testing SSR markup.
            await evaluate(
                sessionId,
                `document.querySelector('button[aria-controls="mobile-menu"]').focus()`
            );
            assert.ok(
                await evaluate(
                    sessionId,
                    `document.activeElement.matches('button[aria-controls="mobile-menu"]')`
                ),
                `${label}: toggle focus`
            );
            await key(sessionId, 'Enter', 13);
            await waitFor(
                sessionId,
                `document.querySelector('button[aria-controls="mobile-menu"]').getAttribute('aria-expanded') === 'true'`
            );
            await key(sessionId, 'Tab', 9);
            assert.ok(
                await evaluate(sessionId, `!!document.activeElement.closest('#mobile-menu')`),
                `${label}: menu focus`
            );
            await key(sessionId, 'Escape', 27);
            await waitFor(
                sessionId,
                `document.activeElement.matches('button[aria-controls="mobile-menu"][aria-expanded="false"]')`
            );
        }
        if (!scenario.nojs && !scenario.route) {
            await waitFor(
                sessionId,
                scenario.reduced
                    ? `document.querySelectorAll('canvas').length >= 1`
                    : `window.__draws.grid > 2`
            );
        }
        await sleep(400);
        const dom = await evaluate(
            sessionId,
            `({
            width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
            h1: document.querySelectorAll('main h1').length,
            homeVisible: [...document.querySelectorAll('main h1, main h1 span')].every(el =>
                getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).opacity !== '0'),
            nativeLinks: [...document.querySelectorAll('header a')].filter(el => el.getAttribute('href') !== '/' &&
                el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0).length,
            columns: getComputedStyle(document.querySelector('main h1').parentElement.parentElement).gridTemplateColumns,
            cards: document.querySelectorAll('main a[class*="_card_"]').length,
            dates: [...document.querySelectorAll('time[datetime]')].map(el => [el.dateTime, el.textContent]),
            tokens: document.querySelectorAll('pre .token').length
        })`
        );
        assert.equal(dom.h1, 1, `${label}: H1`);
        assert.ok(dom.scrollWidth <= dom.width + 1, `${label}: horizontal overflow`);
        if (!scenario.route) {
            assert.ok(dom.homeVisible, `${label}: visible identity without animation dependence`);
            if (scenario.desktop)
                assert.equal(dom.columns.split(' ').length, 2, 'Desktop hero columns');
        }
        if (scenario.nojs) {
            assert.ok(dom.nativeLinks > 0, `${label}: native navigation`);
            if (['hub/follows', 'hub/library'].includes(scenario.route)) {
                const expected = pageDocument(scenario.route).querySelectorAll(
                    'main a[class*="_card_"]'
                ).length;
                assert.ok(expected > 0, `${label}: populated collection`);
                assert.equal(dom.cards, expected, `${label}: complete prerendered collection`);
            }
        }
        if (['hub/mataa3', 'hub/my-terminal-and-editor-setup-2026'].includes(scenario.route)) {
            const expected = [
                ...pageDocument(scenario.route).querySelectorAll('time[datetime]'),
            ].map((el) => [el.dateTime, el.textContent]);
            assert.ok(expected.length > 0, `${label}: semantic publication dates`);
            assert.deepEqual(dom.dates, expected, `${label}: timezone-stable hydration`);
        }
        if (scenario.route.includes('terminal-and-editor')) {
            await waitFor(sessionId, `document.querySelectorAll('pre .token').length > 0`);
            if (!scenario.nojs)
                await waitFor(
                    sessionId,
                    `performance.getEntriesByType('resource').some(resource => resource.name.includes('code-highlighter'))`
                );
        }
        if (!scenario.nojs && !scenario.route) {
            const before = await evaluate(sessionId, 'window.__draws');
            await sleep(250);
            const idle = await evaluate(sessionId, 'window.__draws');
            assert.equal(idle.spark, before.spark, `${label}: idle spark loop`);
            if (scenario.reduced) assert.equal(idle.grid, before.grid, 'Reduced-motion grid loop');
            else {
                await evaluate(
                    sessionId,
                    `document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 40, clientY: 40 }))`
                );
                await sleep(800);
                const burst = await evaluate(sessionId, 'window.__draws.spark');
                assert.ok(burst > idle.spark, 'Normal-motion click burst');
                await sleep(250);
                assert.equal(
                    await evaluate(sessionId, 'window.__draws.spark'),
                    burst,
                    'Spark loop stops'
                );
            }
        }
        const scripts = [...requests.values()]
            .filter(
                (request) => request.type === 'Script' && request.url.startsWith(`${base}/assets/`)
            )
            .map((request) => request.url);
        if (!scenario.nojs && !scenario.route) {
            assert.ok(scripts.length > 0, `${label}: actual script loading`);
            assert.ok(
                !scripts.some((url) => url.includes('code-highlighter')),
                'Highlighter must stay deferred on home'
            );
            const bytes = assetBytes(scripts);
            assert.ok(
                bytes <= budgets.homeJs,
                `Home JS ${bytes} exceeds ${budgets.homeJs} gzip bytes`
            );
            console.log(`PASS requested home JS budget: ${bytes}/${budgets.homeJs} gzip bytes`);
        }
        if (!scenario.nojs && scenario.route.includes('terminal-and-editor')) {
            assert.ok(
                scripts.some((url) => url.includes('code-highlighter')),
                'Code pages load the actual highlighter'
            );
        }
        assert.deepEqual(errors, [], `${label}: runtime or first-party asset errors`);
        console.log(`PASS browser: ${label}`);
        listeners.delete(listener);
        await send('Target.closeTarget', { targetId });
    }
} finally {
    try {
        if (socket?.readyState === WebSocket.OPEN) await send('Browser.close');
    } finally {
        socket?.close();
        for (const request of pending.values()) clearTimeout(request.timer);
        for (const child of children) {
            if (child.pid && child.exitCode === null && child.signalCode === null) {
                const exited = once(child, 'exit');
                child.kill();
                await exited;
            }
        }
        await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    }
}

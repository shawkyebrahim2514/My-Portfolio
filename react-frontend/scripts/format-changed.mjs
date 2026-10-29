import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('..');
const base = process.env.FORMAT_BASE_SHA || 'origin/Development';
const git = (args) =>
    execFileSync('git', args, { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const paths = [
    ...new Set([
        ...git(['diff', '--name-only', '--diff-filter=ACMR', '-z', base, '--', 'react-frontend']),
        ...git(['ls-files', '--others', '--exclude-standard', '-z', '--', 'react-frontend']),
    ]),
]
    .filter((file) => /\.(?:[cm]?js|tsx?|css|json)$/.test(file))
    .map((file) => resolve(root, file))
    .filter(existsSync);

if (paths.length) {
    const result = spawnSync(
        process.execPath,
        [resolve('node_modules', 'prettier', 'bin', 'prettier.cjs'), '--check', ...paths],
        { stdio: 'inherit' }
    );
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
} else {
    console.log('No changed frontend source files to format-check.');
}

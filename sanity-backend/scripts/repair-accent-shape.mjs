import { getCliClient } from 'sanity/cli';

// Repair: some hubEntry.accent values were written by earlier scripts as a
// partial color object ({_type:'color', hex}) with no hsl/hsv/rgb/alpha. The
// @sanity/color-input widget reads those sub-objects to render its picker, so a
// partial value makes the field throw and disappear in Studio. This rewrites
// every stored accent into the full, widget-compatible shape (computed from
// the hex) so the field renders and stays editable.
const client = getCliClient({ apiVersion: '2023-01-01' });

const hexToRgb = (hex) => {
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
    };
};

const rgbToHslHsv = ({ r, g, b }) => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const d = max - min;

    let h = 0;
    if (d !== 0) {
        if (max === rn) h = ((gn - bn) / d) % 6;
        else if (max === gn) h = (bn - rn) / d + 2;
        else h = (rn - gn) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
    }

    const l = (max + min) / 2;
    const sHsl = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

    const v = max;
    const sHsv = max === 0 ? 0 : d / max;

    return {
        hsl: { h, s: sHsl, l },
        hsv: { h, s: sHsv, v },
    };
};

const buildColor = (hex) => {
    const rgb = hexToRgb(hex);
    const { hsl, hsv } = rgbToHslHsv(rgb);
    return {
        _type: 'color',
        hex,
        alpha: 1,
        hsl: { _type: 'hslaColor', a: 1, h: hsl.h, s: hsl.s, l: hsl.l },
        hsv: { _type: 'hsvaColor', a: 1, h: hsv.h, s: hsv.s, v: hsv.v },
        rgb: { _type: 'rgbaColor', a: 1, r: rgb.r, g: rgb.g, b: rgb.b },
    };
};

const hasBrokenColorShape = (accent) =>
    Boolean(accent) &&
    (!accent.rgb || !accent.hsl || !accent.hsv || typeof accent.alpha !== 'number');

const repairHubEntryAccents = async () => {
    const brokenEntries = await client.fetch(
        `*[_type=="hubEntry" && defined(accent) && (!defined(accent.rgb) || !defined(accent.hsl) || !defined(accent.hsv) || !defined(accent.alpha))]{_id, title, "hex": accent.hex}`,
    );

    if (brokenEntries.length === 0) return 0;

    console.log(`Repairing ${brokenEntries.length} hubEntry accent value(s):`);
    let tx = client.transaction();
    let patched = 0;
    for (const doc of brokenEntries) {
        if (!doc.hex) {
            console.log(`  - SKIP ${doc._id} (no hex to rebuild from)`);
            continue;
        }
        console.log(`  - ${doc._id}  ${doc.title}  ${doc.hex}`);
        tx = tx.patch(doc._id, (p) => p.set({ accent: buildColor(doc.hex) }));
        patched += 1;
    }
    if (patched > 0) {
        await tx.commit();
    }
    return patched;
};

const repairDirectoryChannelAccents = async () => {
    const docs = await client.fetch(
        `*[_type=="hubChannelsDirectoryPage" && count(channels[defined(accent) && (!defined(accent.rgb) || !defined(accent.hsl) || !defined(accent.hsv) || !defined(accent.alpha))]) > 0]{
            _id,
            title,
            channels
        }`,
    );

    if (docs.length === 0) return 0;

    let tx = client.transaction();
    let patched = 0;
    console.log(`Repairing channel-card accents in ${docs.length} hubChannelsDirectoryPage document(s):`);

    for (const doc of docs) {
        let docPatched = 0;
        const channels = (doc.channels || []).map((channel) => {
            const accent = channel?.accent;
            if (!accent?.hex || !hasBrokenColorShape(accent)) return channel;
            docPatched += 1;
            patched += 1;
            return {
                ...channel,
                accent: buildColor(accent.hex),
            };
        });

        if (docPatched === 0) continue;

        console.log(`  - ${doc._id}  ${doc.title || ''}  (${docPatched} repaired)`);
        tx = tx.patch(doc._id, (p) => p.set({ channels }));
    }

    if (patched > 0) {
        await tx.commit();
    }
    return patched;
};

const run = async () => {
    const repairedEntryAccents = await repairHubEntryAccents();
    const repairedDirectoryAccents = await repairDirectoryChannelAccents();
    const total = repairedEntryAccents + repairedDirectoryAccents;

    if (total === 0) {
        console.log('No partial accent values found — nothing to repair.');
        return;
    }

    console.log(
        `Done. Repaired ${total} accent value(s) (${repairedEntryAccents} entry accents, ${repairedDirectoryAccents} directory channel accents).`,
    );
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});

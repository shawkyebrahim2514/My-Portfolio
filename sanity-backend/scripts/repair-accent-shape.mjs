import { getCliClient } from 'sanity/cli';

// Repair: some hubEntry.accent values were written by earlier scripts as a
// partial color object ({_type:'color', hex}) with no hsl/hsv/rgb/alpha. The
// @sanity/color-input widget reads those sub-objects to render its picker, so a
// partial value makes the field throw and disappear in Studio. This rewrites
// every stored accent into the full, widget-compatible shape (computed from the
// hex) so the field renders and stays editable.
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

const run = async () => {
    // Any entry whose accent is missing the sub-objects the widget needs.
    const broken = await client.fetch(
        `*[_type=="hubEntry" && defined(accent) && (!defined(accent.rgb) || !defined(accent.hsl) || !defined(accent.hsv) || !defined(accent.alpha))]{_id, title, "hex": accent.hex}`,
    );
    if (broken.length === 0) {
        console.log('No partial accent values found — nothing to repair.');
        return;
    }
    console.log(`Repairing ${broken.length} accent value(s):`);
    let tx = client.transaction();
    for (const doc of broken) {
        if (!doc.hex) {
            console.log(`  - SKIP ${doc._id} (no hex to rebuild from)`);
            continue;
        }
        console.log(`  - ${doc._id}  ${doc.title}  ${doc.hex}`);
        tx = tx.patch(doc._id, (p) => p.set({ accent: buildColor(doc.hex) }));
    }
    await tx.commit();
    console.log('Done.');
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});

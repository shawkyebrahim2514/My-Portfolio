/**
 * Rehype plugin: normalize content heading levels.
 *
 * Authors use heading levels in MDX for visual weight (e.g. `####`/`######`),
 * which produces non-sequential outlines like h1 → h4 → h6 and trips the
 * `heading-order` accessibility rule. This remaps the distinct heading levels
 * used in each document to a sequential run starting at <h2> (the page already
 * provides the <h1>), preserving relative hierarchy without skips.
 *
 * Visual sizing is decoupled from semantics in `global.css`, so the rendered
 * appearance is unaffected by the remap.
 */
export default function rehypeNormalizeHeadings() {
  return (tree) => {
    const headings = [];
    const walk = (node) => {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName || '')) {
        headings.push(node);
      }
      if (node.children) {
        for (const child of node.children) walk(child);
      }
    };
    walk(tree);

    if (headings.length === 0) return;

    const distinct = [
      ...new Set(headings.map((h) => Number(h.tagName[1]))),
    ].sort((a, b) => a - b);
    const remap = new Map(
      distinct.map((level, index) => [level, Math.min(6, index + 2)]),
    );

    for (const heading of headings) {
      heading.tagName = `h${remap.get(Number(heading.tagName[1]))}`;
    }
  };
}

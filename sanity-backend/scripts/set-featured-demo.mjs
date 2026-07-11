import { getCliClient } from 'sanity/cli';

// One-off: widen the About "Things Worth Sharing" featured list to a richer,
// more varied set so the redesigned Hub teaser has enough content to show.
// The 3 originals are kept; the 5 added entries are all hidden [DUMMY] docs, so
// the LIVE production site is unchanged (they stay filtered out) while dev and
// ?preview=1 render the full set for design evaluation.
const client = getCliClient({ apiVersion: '2023-01-01' });

const PORTFOLIO_ID = '38ff5cc9-0723-4e11-8279-0f7fbb323a33';
const ABOUT_PAGE_KEY = '616f5fe510c1';

// Order matters — this is the render order in the teaser.
const REFS = [
    'hubEntry-dummy-article-clean-architecture', // article, EN (hidden)
    'hubEntry-channel-mataa3',                   // channel, AR + thumbnail (live)
    'hubEntry-reading-developer-mindset',        // reading list, EN (live)
    'hubEntry-dummy-book-atomic-habits',         // book, EN + cover (hidden)
    'hubEntry-dummy-podcast-craft',              // podcast, EN (hidden)
    'hubEntry-dummy-read-design-details',        // read, EN (hidden)
    'hubEntry-dummy-article-shortcuts',          // article, EN (hidden)
    'hubEntry-dummy-article-arabic-software',    // article, AR/RTL (hidden)
];

const run = async () => {
    const featured = REFS.map((ref, i) => ({
        _key: `feat${i}`,
        _type: 'reference',
        _ref: ref,
    }));

    await client
        .patch(PORTFOLIO_ID)
        .set({ [`pages[_key=="${ABOUT_PAGE_KEY}"].featuredInAbout`]: featured })
        .commit();

    console.log(`Set ${featured.length} featured Hub entries on the About page.`);
    REFS.forEach((r) => console.log(`  - ${r}`));
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});

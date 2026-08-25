// Reframe the Read kind into a curated reading list, delete the now-removed
// Book kind's entry, and repoint the About "featured" ref that pointed at the
// book. Seeds one real reading-list entry whose body holds several readingItem
// blocks (articles the author read elsewhere and recommends). Also removes the
// three dummy read entries the list replaces.
// Run: npx sanity exec scripts/seed-reading-list.mjs --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2023-01-01' });

const key = () => `k${Math.random().toString(36).slice(2, 10)}`;
const block = (text, style = 'normal') => ({
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
});
const read = ({ title, url, source, note }) => ({
    _type: 'readingItem',
    _key: key(),
    title,
    url,
    ...(source ? { source } : {}),
    ...(note ? { note } : {}),
});

const BOOK_ID = 'hubEntry-dummy-book-atomic-habits';
const OLD_READ_IDS = [
    'hubEntry-dummy-read-arabic-faith',
    'hubEntry-dummy-read-design-details',
    'hubEntry-dummy-read-humility',
];

const READING_ID = 'hubEntry-reading-developer-mindset';

const readingEntry = {
    _id: READING_ID,
    _type: 'hubEntry',
    title: 'On becoming a better developer',
    slug: { _type: 'slug', current: 'on-becoming-a-better-developer' },
    kind: 'read',
    language: 'en',
    excerpt:
        'A handful of articles that shaped how I think about the craft — less about syntax, more about mindset, patience, and the habits that make good engineers.',
    categories: [
        { _type: 'reference', _key: key(), _ref: 'hubCategory-career-growth' },
        { _type: 'reference', _key: key(), _ref: 'hubCategory-software-engineering' },
    ],
    tags: ['mindset', 'career', 'craft'],
    body: [
        block(
            'These are pieces I keep coming back to. None of them are about a specific language or framework — they are about how you carry yourself as an engineer over the long run.',
        ),
        read({
            title: 'نصيحة لطلاب الجامعة',
            url: 'https://www.linkedin.com/pulse/%D9%86%D8%B5%D9%8A%D8%AD%D8%A9-%D9%84%D8%B7%D9%84%D8%A7%D8%A8-%D8%A7%D9%84%D8%AC%D8%A7%D9%85%D8%B9%D8%A9-hosam-aly/',
            source: 'Hosam Aly · LinkedIn',
            note: 'نصيحة صادقة لطلاب الجامعة — قريتها في وقت محتاجها فعلاً.',
        }),
        read({
            title: 'Must-Have Skills for Awesome Developers: “Patience”',
            url: 'https://levelup.gitconnected.com/must-have-skills-for-awesome-developers-patience-c0fe64788403',
            source: 'Level Up Coding',
            note: 'The skill nobody lists on a résumé, and the one that separates good engineers from great ones.',
        }),
        read({
            title: 'Learn the fundamentals of a good developer mindset in 15 minutes',
            url: 'https://www.freecodecamp.org/news/learn-the-fundamentals-of-a-good-developer-mindset-in-15-minutes-81321ab8a682/',
            source: 'freeCodeCamp',
            note: 'A quick, grounding read on how to think — not just what to type.',
        }),
        read({
            title: 'What Every Developer Should Know About URLs',
            url: 'https://skorks.com/2010/05/what-every-developer-should-know-about-urls/',
            source: 'Skorks',
            note: 'Old but timeless — the kind of fundamentals we skip and later regret skipping.',
        }),
    ],
    publishedAt: new Date().toISOString(),
    featured: false,
    featuredInCategory: true,
};

async function run() {
    // Create the new reading list first so we can repoint the About ref to it.
    await client.createOrReplace(readingEntry);
    console.log(`seeded reading list ${readingEntry._id} (/hub/${readingEntry.slug.current})`);

    // Repoint the About "featured" ref off the book BEFORE deleting it —
    // Sanity refuses to delete a doc that is still referenced.
    const portfolio = await client.fetch(
        `*[_type == "portfolio"][0]{ _id, "aboutKey": pages[_type == "aboutPage"][0]._key }`,
    );
    if (portfolio?.aboutKey) {
        await client
            .patch(portfolio._id)
            .set({ [`pages[_key=="${portfolio.aboutKey}"].featuredInAbout[_ref=="${BOOK_ID}"]._ref`]: READING_ID })
            .commit();
        console.log(`repointed About featured ref ${BOOK_ID} -> ${READING_ID}`);
    }

    // Now remove the Book entry (kind dropped) and the dummy reads this list replaces.
    for (const id of [BOOK_ID, ...OLD_READ_IDS]) {
        await client.delete(id).catch((e) => console.error(`delete ${id} failed:`, e.message));
        await client.delete(`drafts.${id}`).catch(() => {});
        console.log(`deleted ${id}`);
    }
}

run().then(
    () => process.exit(0),
    (e) => {
        console.error(e);
        process.exit(1);
    },
);

// Seed the new "channel" hub entry (a real channel the author follows, with a
// few of its videos embedded in the body) and remove the two now-obsolete
// dummy "video"-kind entries (the Video kind was dropped — YouTube now lives
// as an inline body block).
// Run: npx sanity exec scripts/seed-channel-mataa3.mjs --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2021-10-21' });

const key = () => `k${Math.random().toString(36).slice(2, 10)}`;
const block = (text, style = 'normal') => ({
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
});
const youtube = (url, caption) => ({ _type: 'youtube', _key: key(), url, caption });

const OBSOLETE_VIDEO_ENTRIES = [
    'hubEntry-dummy-video-career-growth',
    'hubEntry-dummy-video-system-design',
];

const channelEntry = {
    _id: 'hubEntry-channel-mataa3',
    _type: 'hubEntry',
    title: 'متاع - Mataa3',
    slug: { _type: 'slug', current: 'mataa3' },
    kind: 'channel',
    language: 'ar',
    excerpt:
        'منصة تتناول كل ما يخص الزواج والتربية والأمور المسكوت عنها، من جوانب شرعية ونفسية وتربوية بأسلوب واقعي وبسيط.',
    sourceName: 'YouTube',
    channelHandle: '@mataa3',
    externalUrl: 'https://www.youtube.com/@mataa3',
    sourceThumbnail:
        'https://yt3.googleusercontent.com/PVOkhghg6LOE1Vyf17OOD2XXugZmEmtP651bd6xFkQ7-QilUcQfKb3PBnCYtvYZ2hs6_y049=s900-c-k-c0x00ffffff-no-rj',
    categories: [
        { _type: 'reference', _key: key(), _ref: 'hubCategory-faith-reflection' },
        { _type: 'reference', _key: key(), _ref: 'hubCategory-humanity-life' },
    ],
    tags: ['الأسرة', 'التربية', 'الزواج'],
    body: [
        block(
            'قناة بأتابعها باهتمام، بتقدم محتوى مهم عن الزواج والتربية بأسلوب بسيط وواقعي. دي مجموعة من الحلقات اللي وقفت عندها وحبيت أشاركها.',
        ),
        youtube('https://youtu.be/Lu8wbJJi_bM', 'حلقة أثّرت فيا فعلاً — تستاهل المشاهدة بتأنّي.'),
        youtube('https://youtu.be/3d9VyvAqAl4', 'طرح صادق لموضوع بنتجاهله كتير.'),
        youtube('https://youtu.be/ILA80kDn_d4', 'من أكتر الحلقات اللي رجعتلها أكتر من مرة.'),
    ],
    publishedAt: new Date().toISOString(),
    featured: false,
    featuredInCategory: true,
};

async function run() {
    for (const id of OBSOLETE_VIDEO_ENTRIES) {
        await client.delete(id).catch(() => {});
        // Drafts too, if any linger.
        await client.delete(`drafts.${id}`).catch(() => {});
        console.log(`deleted ${id}`);
    }

    await client.createOrReplace(channelEntry);
    console.log(`seeded channel entry ${channelEntry._id} (/hub/${channelEntry.slug.current})`);
}

run().then(
    () => process.exit(0),
    (e) => {
        console.error(e);
        process.exit(1);
    },
);

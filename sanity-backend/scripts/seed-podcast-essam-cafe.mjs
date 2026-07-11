// Replace the dummy podcast entry with a real one: "قهوة عصام" (Qahwet Essam),
// an Arabic tech/culture podcast. Seeds a Podcast-kind hub entry with "Listen
// On" platform links + several episodes embedded in the body as podcastEpisode
// blocks (one pinned as featured). Episode titles + cover art were pulled from
// Spotify's key-free oEmbed endpoint.
// Run: npx sanity exec scripts/seed-podcast-essam-cafe.mjs --with-user-token
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
const episode = ({ title, url, episodeLabel, note, featured = false }) => ({
    _type: 'podcastEpisode',
    _key: key(),
    title,
    url,
    ...(episodeLabel ? { episodeLabel } : {}),
    ...(note ? { note } : {}),
    featured,
});

const OLD_DUMMY_ID = 'hubEntry-dummy-podcast-craft';

const podcastEntry = {
    _id: 'hubEntry-podcast-essam-cafe',
    _type: 'hubEntry',
    title: 'قهوة عصام',
    slug: { _type: 'slug', current: 'essam-cafe' },
    kind: 'podcast',
    language: 'ar',
    excerpt:
        'بودكاست عربي بيقعد مع ناس شغّالة في التقنية والهندسة والثقافة، وبيتكلم بصراحة عن الشغل والحياة والأفكار — على قهوة.',
    sourceName: 'بودكاست عربي',
    sourceThumbnail: 'https://i.scdn.co/image/ab67656300005f1ff85c931441b003e6c98cb1ba',
    platforms: [
        {
            _key: key(),
            platform: 'spotify',
            url: 'https://open.spotify.com/show/57b34WqXbbPpyIJKxcQqii',
        },
        {
            _key: key(),
            platform: 'apple',
            url: 'https://podcasts.apple.com/us/podcast/%D9%82%D9%87%D9%88%D8%A9-%D8%B9%D8%B5%D8%A7%D9%85/id1519535081',
        },
        {
            _key: key(),
            platform: 'website',
            url: 'https://podu.me/podcast/118/kho-aasam',
        },
    ],
    categories: [
        { _type: 'reference', _key: key(), _ref: 'hubCategory-software-engineering' },
        { _type: 'reference', _key: key(), _ref: 'hubCategory-career-growth' },
    ],
    tags: ['بودكاست', 'تقنية', 'هندسة البرمجيات'],
    body: [
        block(
            'من أكتر البودكاستات اللي بسمعها بانتظام. أسلوب بسيط وصريح، وضيوف بيضيفوا فعلاً. دي مجموعة من الحلقات اللي وقفت عندها وحبيت أشاركها.',
        ),
        episode({
            title: 'مراجعة كتاب محمد الجيش — Shipping Machine Learning Systems',
            url: 'https://open.spotify.com/episode/5DPqoNHRT9UCUndcOXj73m',
            episodeLabel: 'مميّزة',
            note: 'حلقة رجعتلها أكتر من مرة — كلام عملي عن نقل أنظمة تعلّم الآلة للإنتاج.',
            featured: true,
        }),
        episode({
            title: 'ليه راست مع أحمد سليمان',
            url: 'https://open.spotify.com/episode/4iKyy6HR0qECUtfgiA5nmc',
            episodeLabel: '01',
            note: 'حوار هادئ وصريح يستاهل السماع بتأنّي.',
        }),
        episode({
            title: 'الواد البراوي: إنفيديا بتعمل إيه بالضبط',
            url: 'https://open.spotify.com/episode/4PhIiZzCdlJvPxYKkv84M5',
            episodeLabel: '02',
            note: 'شرح مبسّط لموضوع تقني بيتكلم عنه الكل من غير ما يفهمه كتير.',
        }),
        episode({
            title: 'قهوة عصام: الزراعة والتقنيات الحديثة مع حازم الطواب',
            url: 'https://open.spotify.com/episode/0HhdFxLCF8YVVniZfEFqV3',
            episodeLabel: '03',
            note: 'تقاطع لطيف بين التقنية ومجال ما بنربطه بيها كتير.',
        }),
    ],
    publishedAt: new Date().toISOString(),
    featured: false,
    featuredInCategory: true,
};

async function run() {
    // Remove the old dummy podcast (and any lingering draft).
    await client.delete(OLD_DUMMY_ID).catch(() => {});
    await client.delete(`drafts.${OLD_DUMMY_ID}`).catch(() => {});
    console.log(`deleted ${OLD_DUMMY_ID}`);

    await client.createOrReplace(podcastEntry);
    console.log(`seeded podcast entry ${podcastEntry._id} (/hub/${podcastEntry.slug.current})`);
}

run().then(
    () => process.exit(0),
    (e) => {
        console.error(e);
        process.exit(1);
    },
);

#!/usr/bin/env node
/**
 * Seeds dummy Hub content (hubCategory + hubEntry docs, one of each `kind`,
 * plus an hubPage singleton) into the Sanity dataset so the new schema can be
 * exercised end-to-end (Studio editing + frontend querying) before any real
 * content is authored.
 *
 * SAFETY: refuses to run unless the resolved client's dataset is exactly
 * "staging" (pass --dataset=production --i-am-sure to override, which you
 * should never need to do for dummy/test data).
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/seed-hub-dummy-data.mjs --with-user-token
 *
 * Safe to re-run: uses deterministic `_id`s (createOrReplace), so re-running
 * just refreshes the same dummy docs instead of duplicating them.
 */

import { getCliClient } from 'sanity/cli'

const scriptArgs = process.argv.slice(2)
const ALLOW_PRODUCTION = scriptArgs.includes('--i-am-sure')
const datasetFlag = scriptArgs.find((a) => a.startsWith('--dataset='))
const TARGET_DATASET = datasetFlag ? datasetFlag.split('=')[1] : undefined

const client = getCliClient({ apiVersion: '2023-01-01', dataset: TARGET_DATASET })

if (client.config().dataset !== 'staging' && !ALLOW_PRODUCTION) {
  console.error(
    `Refusing to run against dataset "${client.config().dataset}". This script seeds ` +
      `throwaway dummy data and should only ever target "staging". Pass ` +
      `--dataset=staging explicitly if SANITY_STUDIO_DATASET isn't already set to staging, ` +
      `or --i-am-sure to override (not recommended).`,
  )
  process.exit(1)
}

const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: `k${Math.random().toString(36).slice(2, 10)}`,
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: `k${Math.random().toString(36).slice(2, 10)}`, text, marks: [] }],
})

// Bulleted list item — exercises the RTL-aware list marker in RichContent.
const bullet = (text) => ({ ...block(text), listItem: 'bullet', level: 1 })

// Numbered list item — exercises the ordered-list counter in RichContent.
const numbered = (text) => ({ ...block(text), listItem: 'number', level: 1 })

// Fenced code block — exercises the syntax-highlighted CodeBlock renderer.
const code = (codeText, language = 'text', filename, highlightedLines) => ({
  _type: 'code',
  _key: `k${Math.random().toString(36).slice(2, 10)}`,
  code: codeText,
  language,
  ...(filename ? { filename } : {}),
  ...(highlightedLines ? { highlightedLines } : {}),
})

// Minimal `icon.manager` value (matching sanity-plugin-icon-manager with
// inlineSvg:true). The frontend only reads `icon.metadata.inlineSvg`; this
// gives the seeded categories real, currentColor-based SVGs so the chip icons
// can be verified without hand-picking icons in Studio.
const iconManager = (iconName, inlineSvg) => ({
  _type: 'icon.manager',
  icon: iconName,
  metadata: {
    iconName,
    inlineSvg,
    collectionId: 'mdi',
    collectionName: 'Material Design Icons',
    hFlip: false,
    vFlip: false,
    flip: '',
    rotate: 0,
    size: { width: 24, height: 24 },
  },
})

const svg = (path) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="${path}"/></svg>`

const categories = [
  {
    _id: 'hubCategory-software-engineering',
    _type: 'hubCategory',
    title: 'Software Engineering',
    slug: { _type: 'slug', current: 'software-engineering' },
    description: 'Things I learn and build as a software engineer — code, architecture, tools.',
    accentColor: 'secondary',
    order: 1,
    icon: iconManager(
      'mdi:code-tags',
      svg('M14.6 16.6l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6zM9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6l6 6z'),
    ),
  },
  {
    _id: 'hubCategory-faith-reflection',
    _type: 'hubCategory',
    title: 'Faith & Reflection',
    slug: { _type: 'slug', current: 'faith-reflection' },
    description: 'Reflections and resources on faith.',
    accentColor: 'base',
    order: 2,
    icon: iconManager(
      'mdi:hand-heart',
      svg(
        'M2 20h4V9H2zm19.83-7.12c.11-.25.17-.52.17-.8V11a2 2 0 0 0-2-2h-5.5l.92-4.65c.02-.1.03-.2.03-.31c0-.41-.17-.79-.44-1.06L14 2L7.59 8.41C7.21 8.79 7 9.3 7 9.83V19a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22z',
      ),
    ),
  },
  {
    _id: 'hubCategory-humanity-life',
    _type: 'hubCategory',
    title: 'Humanity & Life',
    slug: { _type: 'slug', current: 'humanity-life' },
    description: 'On being human — growth, relationships, and everyday life lessons.',
    accentColor: 'secondary',
    order: 3,
    icon: iconManager(
      'mdi:account-group',
      svg(
        'M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z',
      ),
    ),
  },
  {
    _id: 'hubCategory-productivity-tools',
    _type: 'hubCategory',
    title: 'Productivity & Tools',
    slug: { _type: 'slug', current: 'productivity-tools' },
    description: 'Workflows, apps, and tools that help me build faster and think clearer.',
    accentColor: 'base',
    order: 4,
    icon: iconManager(
      'mdi:tools',
      svg(
        'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9c-2-2-5-2.4-7.4-1.3L9 6L6 9L1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
      ),
    ),
  },
  {
    _id: 'hubCategory-design-ux',
    _type: 'hubCategory',
    title: 'Design & UX',
    slug: { _type: 'slug', current: 'design-ux' },
    description: 'Notes on visual design, interaction, and building interfaces people enjoy.',
    accentColor: 'secondary',
    order: 5,
    icon: iconManager(
      'mdi:palette',
      svg(
        'M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5c0 .12.05.23.13.33c.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22m0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4c0-3.86-3.59-7-8-7m-5.5 6a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m3-4a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m5 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m3 4a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3',
      ),
    ),
  },
  {
    _id: 'hubCategory-career-growth',
    _type: 'hubCategory',
    title: 'Career & Growth',
    slug: { _type: 'slug', current: 'career-growth' },
    description: 'Lessons on growing as an engineer — communication, leadership, and learning.',
    accentColor: 'base',
    order: 6,
    icon: iconManager(
      'mdi:chart-line',
      svg('M16 11.78l4.24-7.33l1.73 1l-5.23 9.05l-6.51-3.75L5.46 19H22v2H2V3h2v14.54L9.5 8z'),
    ),
  },
]

const entries = [
  {
    _id: 'hubEntry-dummy-article-clean-architecture',
    _type: 'hubEntry',
    title: '[DUMMY] Notes on Clean Architecture in React Apps',
    slug: { _type: 'slug', current: 'notes-on-clean-architecture-in-react-apps' },
    kind: 'article',
    categories: [{ _type: 'reference', _ref: 'hubCategory-software-engineering', _key: 'cat1' }],
    tags: ['react', 'architecture', 'frontend'],
    excerpt: 'A few practical patterns I keep reaching for when structuring larger React codebases.',
    publishedAt: new Date().toISOString(),
    featured: true,
    featuredInCategory: true,
    body: [
      block('This is placeholder dummy content used to validate the hubEntry schema end-to-end.'),
      block('Key Takeaways', 'h3'),
      block('Separate data-fetching from presentation. Keep components dumb where possible.'),
      block('A dependency-friendly folder layout I keep reaching for:'),
      numbered('Domain — pure business types and rules, zero framework imports.'),
      numbered('Application — use-cases that orchestrate the domain.'),
      numbered('Infrastructure — Sanity clients, HTTP, and other adapters.'),
      numbered('UI — React components that only speak to the application layer.'),
      block('A tiny use-case reads cleanly when the data layer is injected:'),
      code(
        `type GetEntries = (client: SanityClient) => Promise<HubEntry[]>;

export const getEntries: GetEntries = async (client) => {
  const query = '*[_type == "hubEntry"] | order(publishedAt desc)';
  return client.fetch(query);
};`,
        'typescript',
        'application/getEntries.ts',
        [6],
      ),
      block('Because the transport is a parameter, the same use-case runs in tests with an in-memory stub and no network at all.'),
    ],
  },
  {
    _id: 'hubEntry-dummy-video-system-design',
    _type: 'hubEntry',
    title: '[DUMMY] System Design Primer (YouTube)',
    slug: { _type: 'slug', current: 'system-design-primer-youtube' },
    kind: 'video',
    categories: [{ _type: 'reference', _ref: 'hubCategory-software-engineering', _key: 'cat1' }],
    tags: ['system-design', 'video'],
    excerpt: 'A clear, well-paced walkthrough of core system design concepts. Great refresher.',
    sourceName: 'ByteByteGo — YouTube',
    sourceThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationLabel: '18 min watch',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    featured: true,
    body: [block('My personal note: revisit the caching section, it maps well to our staging setup.')],
  },
  {
    _id: 'hubEntry-dummy-podcast-craft',
    _type: 'hubEntry',
    title: '[DUMMY] On the Craft of Software (Podcast)',
    slug: { _type: 'slug', current: 'on-the-craft-of-software-podcast' },
    kind: 'podcast',
    categories: [{ _type: 'reference', _ref: 'hubCategory-humanity-life', _key: 'cat1' }],
    tags: ['podcast', 'craft'],
    excerpt: 'A conversation about staying curious and humble while building software for decades.',
    sourceName: 'Software Engineering Radio',
    sourceThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    externalUrl: 'https://example.com/podcast/on-the-craft-of-software',
    durationLabel: '52 min episode',
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    featured: false,
    body: [block('Loved the honesty in this episode about burnout and pacing yourself.')],
  },
  {
    _id: 'hubEntry-dummy-read-humility',
    _type: 'hubEntry',
    title: '[DUMMY] The Quiet Power of Humility',
    slug: { _type: 'slug', current: 'the-quiet-power-of-humility' },
    kind: 'read',
    categories: [{ _type: 'reference', _ref: 'hubCategory-faith-reflection', _key: 'cat1' }],
    tags: ['reflection', 'article'],
    excerpt: 'A short essay on humility as strength, not weakness — worth the five minutes.',
    sourceName: 'Example Blog',
    externalUrl: 'https://example.com/articles/the-quiet-power-of-humility',
    durationLabel: '5 min read',
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    featured: false,
    body: [block('Resonated a lot with this — bookmarking to revisit.')],
  },
  {
    _id: 'hubEntry-dummy-book-atomic-habits',
    _type: 'hubEntry',
    title: '[DUMMY] Atomic Habits',
    slug: { _type: 'slug', current: 'atomic-habits' },
    kind: 'book',
    categories: [{ _type: 'reference', _ref: 'hubCategory-humanity-life', _key: 'cat1' }],
    tags: ['book', 'habits', 'productivity'],
    excerpt: 'Practical, well-structured advice on building good habits and breaking bad ones.',
    sourceName: 'James Clear',
    externalUrl: 'https://jamesclear.com/atomic-habits',
    durationLabel: '4-5 hr read',
    publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    featured: true,
    body: [block('The "1% better every day" framing is what stuck with me most.')],
  },
  {
    _id: 'hubEntry-dummy-article-shortcuts',
    _type: 'hubEntry',
    title: '[DUMMY] My Terminal & Editor Setup for 2026',
    slug: { _type: 'slug', current: 'my-terminal-and-editor-setup-2026' },
    kind: 'article',
    categories: [{ _type: 'reference', _ref: 'hubCategory-productivity-tools', _key: 'cat1' }],
    tags: ['tooling', 'workflow', 'terminal'],
    excerpt: 'The small set of tools and shortcuts that quietly save me hours every week.',
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    featured: false,
    body: [block('A living list of the tools I actually keep coming back to.')],
  },
  {
    _id: 'hubEntry-dummy-read-design-details',
    _type: 'hubEntry',
    title: '[DUMMY] The Details That Make Interfaces Feel Right',
    slug: { _type: 'slug', current: 'details-that-make-interfaces-feel-right' },
    kind: 'read',
    categories: [{ _type: 'reference', _ref: 'hubCategory-design-ux', _key: 'cat1' }],
    tags: ['design', 'ux', 'micro-interactions'],
    excerpt: 'Why the tiny transitions and spacing choices matter more than we admit.',
    sourceName: 'Example Design Blog',
    externalUrl: 'https://example.com/articles/details-that-make-interfaces-feel-right',
    durationLabel: '7 min read',
    publishedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    featured: false,
    featuredInCategory: true,
    body: [block('Bookmarking the section on motion — great examples.')],
  },
  {
    _id: 'hubEntry-dummy-video-career-growth',
    _type: 'hubEntry',
    title: '[DUMMY] From Junior to Senior: What Actually Changes',
    slug: { _type: 'slug', current: 'from-junior-to-senior-what-changes' },
    kind: 'video',
    categories: [
      { _type: 'reference', _ref: 'hubCategory-career-growth', _key: 'cat1' },
      { _type: 'reference', _ref: 'hubCategory-software-engineering', _key: 'cat2' },
    ],
    tags: ['career', 'growth', 'video'],
    excerpt: 'A grounded take on how impact and communication outgrow raw coding over time.',
    sourceName: 'Dev Talks — YouTube',
    sourceThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationLabel: '24 min watch',
    publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    featured: false,
    body: [block('The part about "owning outcomes, not tasks" is worth re-watching.')],
  },
  {
    _id: 'hubEntry-dummy-article-arabic-software',
    _type: 'hubEntry',
    title: '[DUMMY] تأملات في هندسة البرمجيات',
    slug: { _type: 'slug', current: 'reflections-on-software-engineering-ar' },
    kind: 'article',
    language: 'ar',
    categories: [{ _type: 'reference', _ref: 'hubCategory-software-engineering', _key: 'cat1' }],
    tags: ['هندسة-البرمجيات', 'تأملات', 'عربي'],
    excerpt: 'بعض الأفكار العملية التي أعود إليها دائمًا عند بناء أنظمة برمجية أكبر وأكثر تعقيدًا.',
    publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    featured: true,
    featuredInCategory: true,
    body: [
      block(
        'هذا محتوى عربي تجريبي للتأكد من أن الاتجاه من اليمين إلى اليسار (RTL) والخط العربي يعملان بشكل صحيح عبر عنوان المقال ونصه وقوائمه.',
      ),
      block('أهم النقاط', 'h3'),
      block('عند بناء أنظمة أكبر، أعود دائمًا إلى مجموعة صغيرة من المبادئ الأساسية:'),
      bullet('افصل جلب البيانات عن طبقة العرض قدر الإمكان.'),
      bullet('اجعل المكوّنات بسيطة (dumb components) حيثما أمكن ذلك.'),
      bullet('استعمل الأنواع (types) لتوثيق النوايا وتقليل الأخطاء.'),
      block('وأتبع هذه الخطوات عند إضافة ميزة جديدة:'),
      numbered('أبدأ بكتابة اختبار صغير يصف السلوك المطلوب.'),
      numbered('أكتب أبسط كود يجعل الاختبار ينجح.'),
      numbered('أعيد صياغة الكود (refactor) مع بقاء الاختبارات خضراء.'),
      block('وحتى داخل نص عربي، تبقى الشيفرة البرمجية بالاتجاه الصحيح من اليسار إلى اليمين:'),
      code(
        `def greet(name: str) -> str:
    return f"Hello, {name}!"`,
        'python',
        'greet.py',
      ),
      block(
        'الاختبار المبكر يوفّر ساعات من التصحيح لاحقًا، والبساطة تكاد تكون دائمًا الخيار الأصح على المدى الطويل.',
      ),
    ],
  },
  {
    _id: 'hubEntry-dummy-read-arabic-faith',
    _type: 'hubEntry',
    title: '[DUMMY] القوة الهادئة في التواضع',
    slug: { _type: 'slug', current: 'the-quiet-power-of-humility-ar' },
    kind: 'read',
    language: 'ar',
    categories: [{ _type: 'reference', _ref: 'hubCategory-faith-reflection', _key: 'cat1' }],
    tags: ['تأمل', 'تواضع', 'عربي'],
    excerpt: 'مقالة قصيرة عن التواضع بوصفه قوة لا ضعفًا — تستحق خمس دقائق من وقتك.',
    sourceName: 'مدوّنة تجريبية',
    externalUrl: 'https://example.com/articles/the-quiet-power-of-humility-ar',
    durationLabel: 'قراءة ٥ دقائق',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    featured: false,
    body: [block('تأمل جميل — أضفته إلى قائمة القراءة كي أعود إليه مرة أخرى.')],
  },
]

const hubPage = {
  _id: 'hubPage-singleton',
  _type: 'hubPage',
  title: { highlightedText: 'Hub', subText: 'What I share' },
  intro: [
    block(
      'A place where I document and share what I learn and think about — software engineering, faith, and everyday humanity.',
    ),
  ],
}

async function run() {
  console.log(`Seeding dummy Hub data into dataset "${client.config().dataset}"...`)

  for (const doc of [...categories, ...entries, hubPage]) {
    await client.createOrReplace(doc)
    console.log(`  upserted ${doc._type}: ${doc._id}`)
  }

  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

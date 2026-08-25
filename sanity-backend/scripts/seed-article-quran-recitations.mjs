#!/usr/bin/env node
/**
 * Adds the public Faith Listening List of one-off Quran recitation clips.
 * Creates the document if missing. If an older Article version exists,
 * patches it to `listen` + listeningItems. Later listen edits are left alone.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/seed-article-quran-recitations.mjs --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2023-01-01'})

const ARTICLE_ID = 'hubEntry-article-quran-recitations'
const FAITH_CATEGORY_ID = 'hubCategory-faith-reflection'

const key = () => `k${Math.random().toString(36).slice(2, 10)}`
const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})
const listeningItem = (title, credit, url) => ({
  _type: 'listeningItem',
  _key: key(),
  title,
  credit,
  url,
})

const clips = [
  {
    title: 'سورة البقرة',
    credit: 'الشيخ أكرم عبدالله العلاقمي',
    url: 'https://www.youtube.com/watch?v=ODiWWP16bPU',
  },
  {
    title: 'سورة المطففين',
    credit: 'الشيخ عبدالله كامل',
    url: 'https://www.youtube.com/watch?v=oIJkHjblFxU',
  },
  {
    title: 'سورة الكهف — تلاوة مجوّدة',
    credit: 'الشيخ محمد صديق المنشاوي',
    url: 'https://www.youtube.com/watch?v=6MItl7jFRU0',
  },
  {
    title: 'ختم القرآن ودعاء ليلة القدر',
    credit: 'الشيخ محمد جبريل',
    url: 'https://www.youtube.com/watch?v=LCvRgXJMvFk',
  },
  {
    title: 'سورة الكهف',
    credit: 'الشيخ محمد صديق المنشاوي',
    url: 'https://www.youtube.com/watch?v=ncq6audWvow',
  },
  {
    title: 'تلاوة من سورة الأعراف',
    credit: 'الشيخ مصطفى إسماعيل',
    url: 'https://www.youtube.com/watch?v=T_-NdZe4mnM',
  },
  {
    title: 'تلاوة من سورة يوسف',
    credit: 'الشيخ مصطفى إسماعيل',
    url: 'https://www.youtube.com/watch?v=mPnV735frK4',
  },
  {
    title: 'سورة النجم',
    credit: 'الشيخ أحمد نعينع',
    url: 'https://www.youtube.com/watch?v=2EfGo6CWj98',
  },
  {
    title: 'سورة النجم',
    credit: 'الشيخ محمد فوزي البربري',
    url: 'https://www.youtube.com/watch?v=ly0p0TjtspI',
  },
  {
    title: 'سورة المزمل',
    credit: 'الشيخ أحمد الأمين',
    url: 'https://www.youtube.com/watch?v=-lC0mL-Js1w',
  },
  {
    title: 'سورة مريم',
    credit: 'إبراهيم إدريس',
    url: 'https://www.youtube.com/watch?v=z0KNzQCA8d4',
  },
  {
    title: 'سورة التوبة',
    credit: 'مهدي الشيشاني',
    url: 'https://www.youtube.com/watch?v=r8h4oezLa2A',
  },
]

const listenBody = [
  block(
    'مش قناة واحدة بأتابعها. دي تلاوات من قراء مختلفين رجعت لها أكتر من مرة، فحبيت أجمعها هنا.',
  ),
  ...clips.map((clip) => listeningItem(clip.title, clip.credit, clip.url)),
]

const entry = {
  _id: ARTICLE_ID,
  _type: 'hubEntry',
  title: 'تلاوات أرجع إليها',
  slug: {_type: 'slug', current: 'quran-recitations-i-return-to'},
  kind: 'listen',
  language: 'ar',
  excerpt: 'تلاوات متفرقة من قراء مختلفين أرجع إليها — ليست قناة واحدة، بل أصوات وقفت عندها.',
  categories: [{_type: 'reference', _key: key(), _ref: FAITH_CATEGORY_ID}],
  tags: ['قرآن', 'تلاوة'],
  durationLabel: '12 تلاوة',
  body: listenBody,
  publishedAt: new Date().toISOString(),
  featured: false,
  featuredInCategory: true,
  hiddenInProduction: false,
}

async function run() {
  const existing = await client.getDocument(ARTICLE_ID)
  if (!existing?._id) {
    await client.createIfNotExists(entry)
    console.log(`Created ${ARTICLE_ID} as listen (/hub/${entry.slug.current})`)
    return
  }

  if (existing.kind === 'listen') {
    console.log(`Already a listening list: ${ARTICLE_ID} (/hub/${existing.slug?.current ?? entry.slug.current})`)
    return
  }

  await client
    .patch(ARTICLE_ID)
    .set({kind: 'listen', body: listenBody, durationLabel: entry.durationLabel})
    .commit()
  console.log(`Migrated ${ARTICLE_ID} from ${existing.kind} to listen (/hub/${existing.slug?.current})`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

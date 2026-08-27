# Sanity Studio

Content studio for the portfolio and Hub. The Studio runs locally at
<http://localhost:3333> and is deployed at
<https://portfolio.sanity.studio>.

Portfolio Pages, Hub index, and Follows page are singletons. Studio
opens each document directly; you cannot create a second copy. Experience,
projects, skills, and the other lists live under **Portfolio**. Hub entries
and Follows live under **Hub**.

## Local development

```bash
npm install
npm run dev
```

The rich-content editor includes Callouts, semantic Notes, uploaded/external
Image Rows, Figures, Link Previews, Reading Items, Listening Items, Key Takeaways,
Quote/Citations, Expandable Details, and Curated Videos with nested companion
content. Facebook-only reels, videos, posts, photos, and articles use the
dedicated Facebook Resource card rather than an unreliable inline embed.

Hub entries keep shared editorial, taxonomy, and publishing fields at the
document root. Channel-specific identity and content live under `channel`,
whose rich body preserves authored order and supports full-width Curated Video
blocks. Its focused `moreVideos` array renders ordinary recommendations as one
grid at the end of the page.

**Follow** documents power `/hub/follows`: every Follow appears there,
featured first, then by name. Filter by type, platform, and category.
Each card can have an avatar, cover, accent color, short note, and an
optional Channel Hub deep-dive. The **Follows page** document is only
the title and intro. Pick Worth Following on **About → Featured Follows**.

Automatic URL metadata uses the frontend's Vercel function. For local testing,
run `npx vercel dev --listen 3002` from `react-frontend`. Channel metadata uses
port 3002; ordinary frontend and link-preview development remains on port 3000.

For YouTube Channels, pasting a channel URL also imports the official name,
stable channel ID, handle, canonical URL, and remote avatar URL through
`/api/youtube-channel`. The frontend Vercel project must define a server-only
`YOUTUBE_DATA_API_KEY` restricted to YouTube Data API v3.

## Hub launch baseline (production-safe starter content)

Run these one-time scripts with a Sanity user token to prepare the Hub with
real starter content and clean production wiring:

```bash
npx sanity exec scripts/seed-channel-mataa3.mjs --with-user-token
npx sanity exec scripts/seed-podcast-essam-cafe.mjs --with-user-token
npx sanity exec scripts/seed-reading-list.mjs --with-user-token
npm run seed:hub:launch
npm run seed:hub:channels
npm run migrate:hub:channels:type
```

`seed:hub:launch` does four things:

- Ensures core Hub categories and the Hub page singleton exist.
- Adds one public starter article entry (`/hub/shipping-a-content-hub-to-production`).
- Sets About-page featured Hub references and software-engineering
  recommendations to real entries that exist in the dataset.
- Marks all legacy `[DUMMY]` entries as `hiddenInProduction: true`.

`seed:hub:channels` creates the Follows page title and intro if they
are missing. It never replaces Follows or wipes live content.

`migrate:hub:channels:type` backfills Follow `type` values
(`subscription` / `creator`) so the two tabs on `/hub/follows` work
consistently for older data.

Pick Worth Following items on the **About** page under **Featured
Follows**, the same way Featured Hub Entries drive Things Worth Sharing.
`migrate:hub:about:follows` copies older per-Follow flags into that list.
`unset:hub:directory:channels` drops leftover Directory refs and the old
per-Follow About flag. `mark-follows-featured-in-about.mjs` can set a
starter mix on About.

`add:hub:youtube` creates curated YouTube Follows if they are missing.
Safe to rerun.

`add:hub:social` creates curated Facebook, LinkedIn, and X Follows if
they are missing. Safe to rerun.

`seed:hub:quran` creates the Faith Listening List of one-off Quran
recitation clips if it is missing, or migrates an older Article version
to `listen`. Safe to rerun after the first listen save.

Hub entry covers are remote URLs with the same crop/zoom controls as
Follows. `migrate:hub:covers:urls` converts leftover uploaded Sanity
images into those URLs. Safe to rerun.

`sync:hub:taxonomy` updates Hub category titles and the Follows set
(Software, Career, Tech, Money, English, Hardware, Curiosity, Design,
Faith, Family, Life), then retags Follows items from
`scripts/data/follows-category-map.json`. It does not wipe Follows or
recommended entries.

## Deployment

Set the public Studio build variable shown in `.env.example`, then deploy:

```bash
npm run deploy
```

The frontend Vercel project must also define the server-only
`SANITY_STUDIO_ORIGIN` variable shown in `react-frontend/.env.example`.

## Structure of Sanity Backend Documents

>Portfolio Document Structure

```
portfolio: Document {
 navbar: Object{
  logo: String
 },
 pages: Array[aboutPage|skillsPage|educationPage|experiencePage|projectsPage|contactsPage],
}
```

### Pages

>About Page Document Structure

```
aboutPage: Document{
 personImage: URL,
 circularRingText: String,
 description: Text,
 resume: Object{
  text: String,
  link: URL
 }
}
```

>Skills Page Document Structure

```
skillsPage: Document{
 title: Object{
  highlightedText: String,
  subText: String
 },
 categories: Array[{
  title: String,
  skills: Array[`reference to skill from skills document`]
 }]
}
```

>Education Page Document Structure

```
educationPage: Document{
 title: Object{
  highlightedText: String,
  subText: String
 },
 education: Object{
  name: String,
  description: Text,
  date: Object{
   start: Date,
   end: Date
  },
  location: String,
  courses: Array[`reference to course from courses document`]
 }
}
```

>Experience Page Document Structure

```
experiencePage: Document{
 internshipsSection: Object{
  title: Object{
   highlightedText: String,
   subText: String
  }, 
  internships: Array[`reference to internship from internships document`]
 },
 certificatesSection: Object{
  title: Object{
   highlightedText: String,
   subText: String
  }, 
  certificates: Array[`reference to certificate from certificates document`]
 }
}
```

>Projects Page Document Structure

```
projectsPage: Document{
 title: Object{
  highlightedText: String,
  subText: String
 },
 projects: Array[`reference to project from projects document`]
}
```

>Contacts Page Document Structure

```
contactsPage: Document{
 title: Object{
  highlightedText: String,
  subText: String
 },
 contacts: Array[`reference to contact from contacts document`]
}
```

---

### Units

>Skills Document Structure

```
skills: Document{
 name: String,
 icon: Image
}
```

>College Courses Document Structure

```
collegeCourses: Document{
 name: String,
 description: Text,
 technologies: Array[`reference to skill from skills document`]
}
```

>Internships Document Structure

```
internships: Document{
 title: String,
 subTitle: String,
 date: Object{
  from: Date,
  to: Date
 },
 link: URL,
 description: Text,
 technologies: Array[`reference to skill from skills document`]
}
```

>Projects Document Structure

```
projects: Document{
 name: String,
 links: Object{
  demoLink: URL,
  projectLink: URL
 },
 description: Text,
 image: Image,
 technologies: Array[`reference to skill from skills document`]
}
```

>Certificates Document Structure

```
certificates: Document{
 title: String,
 subTitle: String,
 description: Text,
 date: Date,
 link: URL
}
```

>Contacts Document Structure

```
contacts: Document{
 name: String,
 link: URL,
 icon: Image
}
```

![Portfolio Diagrams](https://github.com/shawkyebrahim2514/My-Portfolio/assets/101745968/821b2239-437a-42c3-90b0-dc13435edde7)

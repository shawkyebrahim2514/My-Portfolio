# Sanity Studio

Content studio for the portfolio and Hub. The Studio runs locally at
<http://localhost:3333> and is deployed at
<https://portfolio.sanity.studio>.

## Local development

```bash
npm install
npm run dev
```

The rich-content editor includes Callouts, semantic Notes, uploaded/external
Image Rows, Figures, Link Previews, Reading Items, Key Takeaways,
Quote/Citations, Expandable Details, and Curated Videos with nested companion
content. Facebook-only reels, videos, posts, photos, and articles use the
dedicated Facebook Resource card rather than an unreliable inline embed.

Hub entries keep shared editorial, taxonomy, and publishing fields at the
document root. Channel-specific identity and content live under `channel`,
whose rich body preserves authored order and supports full-width Curated Video
blocks. Its focused `moreVideos` array renders ordinary recommendations as one
grid at the end of the page.

For quick curation, the **Hub Channels Directory** document powers
`/hub/follows` (the public **Follows** page): one place to list both Subscriptions and Creators with a short
note, directory/platform/category filters, optional cover image + per-card
accent color, and an optional link to a dedicated Channel Hub deep-dive entry.

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

`seed:hub:channels` seeds the Hub Channels Directory singleton used by
`/hub/follows`.

`migrate:hub:channels:type` backfills directory item `type` values
(`subscription` / `creator`) so the two tabs on `/hub/follows` work
consistently for older data.

Tick **Show on About page** on a Follows item to include it in the
About-page **Worth Following** teaser. `mark-follows-featured-in-about.mjs`
can set a starter mix without overwriting the directory.

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

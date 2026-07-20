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
Quote/Citations, and Expandable Details.

Automatic URL metadata uses the frontend's Vercel function. For local testing,
run `npx vercel dev` from `react-frontend`; Studio automatically calls
`http://localhost:3000/api/link-preview`.

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

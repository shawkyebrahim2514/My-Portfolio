## Structure of Sanity Backend Documents

>Portfolio Document Structure

```json
portfolio: Document {
 navbar: Object{
  logo: String
 },
 pages: Array[aboutPage|skillsPage|educationPage|experiencePage|projectsPage|contactsPage],
}
```

### Pages

>About Page Document Structure

```json
aboutPage: Document{
 personImage: URL,
 salutation: String,
 personName: String,
 seeking: String,
 position: String,
 description: Text,
 resume: Object{
  text: String,
  link: URL
 }
}
```

>Skills Page Document Structure

```json
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

```json
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

```json
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

```json
projectsPage: Document{
 title: Object{
  highlightedText: String,
  subText: String
 },
 projects: Array[`reference to project from projects document`]
}
```

>Contacts Page Document Structure

```json
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

```json
skills: Document{
 name: String,
 icon: Image
}
```

>College Courses Document Structure

```json
collegeCourses: Document{
 name: String,
 description: Text,
 technologies: Array[`reference to skill from skills document`]
}
```

>Internships Document Structure

```json
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

```json
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

```json
certificates: Document{
 title: String,
 subTitle: String,
 description: Text,
 date: Date,
 link: URL
}
```

>Contacts Document Structure

```json
contacts: Document{
 name: String,
 link: URL,
 icon: Image
}
```

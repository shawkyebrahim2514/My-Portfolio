# My Personal Portfolio

## Development

This project now uses [Vite](https://vitejs.dev/) for development and build.

### Getting Started

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

Build for production:

```
npm run build
```

Preview the production build:

```
npm run preview
```

---

## Markdown to HTML

### Markdown Editor

- Open the following link to try the Markdown Editor: [Markdown Editor](https://shawkyebrahim.vercel.app/markdown)

### Headings

> As the default markdown syntax, the headings will be rendered with the base color unless use highlight syntax

```markdown

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Bullet Points

> By default, all points will have a right arrow before them with base color

```markdown
- First Level
  - First First Level
  - First Second Level
- Second Level
```

### Horizontal Lines

```markdown
---
```

### Links

> The normal syntax `[Text](Link)` will be rendered as a text with an icon next to it.
>
> The syntax `[[Text]](Link)` will be rendered as a link button with the text inside it.
>
> The syntax `[[Text|doc]](Link)` will be rendered as a link button with the text inside it and a `document` icon next to it.

```markdown
[Microsoft](https://careers.microsoft.com)

[[Microsoft]](https://careers.microsoft.com)

[[Microsoft|doc]](https://careers.microsoft.com)
```

### Highlight Text

> Use the syntax `**Text Here**` to make the text bold and with the base color.
>
> Use the syntax `**!Text Here!**` to make the text bold and with the secondary color.

```markdown
Hello **Shawky** **!Ebrahim!**
```

### Highlight Text Area

> Use the syntax `**-Text Here-**` to make an area with the base color.
>
> Use the syntax `**!-Text Here-!**` to make an area with the secondary color.

```markdown
Hello **-Shawky-** **!-Ebrahim-!**
```

### Block Quotes

> Use the syntax `> Text Here` to create a block quote with only left bar with base color.
>
> Use the syntax `> [!highlight] Text Here` to create a block quote with left bar and background with base color.
>
> Use the syntax `> [!secondary] Text Here` to create a block quote with only left bar with secondary color.
>
> Use the syntax `> [!secondary highlight] Text Here` to create a block quote with left bar and background with secondary color.
>
> Use the syntax `> [!popup] Text Here` to create a block quote with a popup section without a left bar.

```markdown
> This is a block quote

> [!highlight] This is a block quote with highlight background

> [!secondary] This is a block quote with secondary color

> [!secondary highlight] This is a block quote with secondary color and highlight background

> [!popup] This is a block quote with popup section
```

### Buttons

> Use the syntax `[[Button Text]]` to create a text like a button.

```markdown
[[Text Here]]
```

### Text Alignment

> Use the syntax `[center]`, `[left]`, or `[right]` to align text (Write them wherever you want)

```markdown
[left]This text is left aligned

[center]This text is centered

[right]This text is right aligned
```

### New Line

> Use the syntax `[newline]` to create a new line

```markdown
This is the first line[newline]This is the second line
```

### Gap

> Use the syntax `[gap]` to create a gap

```markdown
This is some text[gap]This is some more text
```

### Images

> Use the syntax `![alt text](url =h500)` to add images with specific height (replace `500` with the desired height)
>
> Use the syntax `![alt text](url =w500)` to add images with specific width (replace `500` with the desired width)
>
> Use any of the above syntax with `|align` to align the image to the left, right, or center: `![alt text](url =w500|center)`

```markdown
![Shawky with Microsoft](https://pbs.twimg.com/media/GYvdPB7XMAAfYRm?format=jpg&name=large =h500|center)
```

### Examples

```markdown
# Shawky Ebrahim [center]
### **!-👨‍💻 Ex-SWE Intern @Microsoft-!** [center]
### **-🎓 Final-Year CS Student-** [center]
[newline]

> [!popup]
> #### Quick Highlights [newline]
> ###### **-💻 SWE Intern @ Microsoft Egypt-**
> ###### **-🎓 CS Student @ Cairo University: GPA 3.7/4.00-**
> ###### **-🛠️ Tech Expertise: ReactJS, TypeScript, Node.js, Flutter, SQL, and more-**
> ###### **-🏆 Achievements: 35th place at the ACPC 2022 Programming Championship-**
```

![Quick Intro About Me](./markdown-examples/quick%20intro.png)

---

```markdown
> [!popup]
> ##### **!-[Clarity Flutter SDK - Microsoft Egypt SWE Internship](https://www.linkedin.com/feed/update/urn:li:activity:7246924250966618112/)-!**
> July 2024 - Sep 2024 [newline]
> > During my Software Engineering Internship at **!Microsoft Egypt!**, I collaborated with the **Clarity Apps team**, contributing to the development of the Clarity **Flutter SDK**, a tool aimed at enhancing user experience tracking and analytics.
> >
> > This project provided hands-on experience in **optimizing performance**, implementing **gesture tracking**, and ensuring robust **user data privacy**. [newline]
> 
> **Key Contributions:**  
> - **Performance Optimization:** Researched and implemented strategies for optimized asset decoding and transfer, reducing performance overhead and improving efficiency.
> - **Gesture Detection & Heatmaps:** Supported the development of features like gesture tracking and visualization, enabling accurate heatmaps and user interaction analysis.  
> - **Screen Capture & Visualization:** Built a Proof of Concept (PoC) leveraging Flutter canvas commands to enable advanced screen capture and visualization functionalities  
> - **Privacy-Centric Features:** Delivered advanced masking techniques to protect user data while maintaining functionality, aligning with Microsoft’s privacy standards.  
> - **Documentation & Collaboration:** Created detailed documentation for the SDK to facilitate onboarding and ensure seamless knowledge transfer for future development. 
>
> [newline] **Technologies Used:**
> - **Languages & Tools:** Dart, Flutter
> - **Focus Areas:** SDK Development, Visualization, Data Privacy 
> [newline]
> > This internship enhanced my skills in **Flutter development**, performance optimization, and data privacy implementation, while fostering a growth mindset through regular feedback and team collaboration. 
> > 
> > I also developed **stronger interpersonal communication** skills by actively seeking input from colleagues and engaging in inclusive discussions, reflecting Microsoft’s emphasis on a collaborative culture"
> 
> [[Flutter]] [[Dart]] [[Microsoft Clarity]] [[Heatmap Visualization]] [[SDK Development]] [[Gesture Tracking]] [[Screen Capture]] [[Documentation]] [[Problem Solving]] [[Agile Workflow]] [[Collaboration]] [[Research And Development]]
```

![Shawky with Clarity Apps Team](./markdown-examples/microsoft%20internship%20experience.png)

---

```markdown
![Microsoft](https://media.licdn.com/dms/image/v2/D4D22AQG8Mljz7jshKA/feedshare-shrink_1280/feedshare-shrink_1280/0/1727801335788?e=1735776000&v=beta&t=86nL5H1md2etP2GvRKYyJZE_VJgm028wgDkE564OqHU =h400|center)
![Microsoft](https://pbs.twimg.com/media/GYvdPB7XMAAfYRm?format=jpg&name=large =h400|center)

![Microsoft](https://media.licdn.com/dms/image/v2/D4D22AQE6h3661nJ6Fw/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1727801335409?e=1735776000&v=beta&t=ZAAsW1b5yfkayCqoMCmF7TFgxReWH9_EmadDMiUsIzU =w735|center)
```

![Shawky with Clarity Apps Team](./markdown-examples/microsoft%20clarity%20apps%20team.png)

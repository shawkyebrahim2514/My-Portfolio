# My Personal Portfolio

## Markdown to HTML

> Open the following link to try the Markdown Editor: [Markdown Editor](https://shawkyebrahim.vercel.app/markdown)

> I use the markdown notations in the backend to make the website content

### Used Markdown Notations

> Headings => Normal markdown notations

- We can use the other features inside the headings

> Bullet Points => Normal markdown notations

- By default, all points will have a right arrow before them with base color

```markdown

- First Level
  - First First Level
  - Firest Second Level
- Second Level

```

Into

```html

<ul style="list-style-type: none;">
    <li class="css-1bj8dih">First Level
        <ul style="list-style-type: none;">
            <li class="css-1bj8dih">First First Level</li>
            <li class="css-1bj8dih">Firest Second Level</li>
        </ul>
    </li>
    <li class="css-1bj8dih">Second Level</li>
</ul>

```

```css

.css-1bj8dih {
    list-style-type: none;
    position: relative;
}

.css-1bj8dih::before {
    content: ">";
    position: absolute;
    top: 0;
    left: -15px;
    font-weight: 600;
}

```

> Horizontal Lines => Normal markdown notations

- By default, it will have a base color line

```markdown

---

```

Into

```html

<div style="margin: 1rem 0px; background-color: rgb(212, 213, 205); height: 1px;"></div>

```

> Using Markdown Notations: Highlight Text

- Use the syntax `**Text Here**` to make the text bold and with the base color
- Use the syntax `**!Text Here!**` to make the text bold and with the secondary color

```markdown

Hello **Shawky** **!Ebrahim!** 

```

Into

```html

<p>
    Hello
    <span style="position: relative; display: inline-block; font-weight: 700;">
        Shawky
    </span>
    <span style="position: relative; display: inline-block; color: rgb(185, 122, 82); font-weight: 700;">
        Ebrahim
    </span>
</p>

```

> Using Markdown Notations: Highlight Text Area

- Use the syntax `**-Text Here-**` to make an area with the base color
- Use the syntax `**!-Text Here-!**` to make an area with the secondary color

```markdown

Hello **-Shawky-** **!-Ebrahim-!** 

```

Into

```html

<p>
    Hello 
    <span style="position: relative; display: inline-block; font-weight: 600;">
        <div style="position: absolute; left: 0px; right: 0px; bottom: 0px; background-color: rgb(189, 189, 182); height: 40%; z-index: -1;"></div>
        Shawky
    </span>
    <span style="position: relative; display: inline-block; font-weight: 600;">
        <div style="position: absolute; left: 0px; right: 0px; bottom: 0px; background-color: rgb(226, 179, 149); height: 40%; z-index: -1;"></div>
        Ebrahim
    </span>
</p>

```

> Using Directives: Highlight Text Area => Use the `span` tag with some configurations

- By default, the background color will be with the base color
- Use the class `highlight-area` to apply the effects
- Add the class `secondary` to make the background color with the secondary one

```markdown

## :span[Ex-SWE intern @Microsoft]{.highlight-area.secondary style="margin-bottom:1rem"}

```

```html

<span class="highlight-area secondary" style="margin-bottom: 1rem; position: relative; display: inline-block;">
    <div style="position: absolute; left: 0px; right: 0px; bottom: 0px; background-color: rgb(226, 179, 149); height: 40%; z-index: -1;"></div>
    Ex-SWE intern @Microsoft
</span>

```

> Using Directives: Highlight Text => Use the `span` tag with some configurations

- By default, the text will be bold and with the base color
- Use the class `highlight-text` to apply the effects
- Add the class `secondary` to make the text with the secondary color

```markdown

I can be a valuable asset to :span[your]{.highlight-text.secondary} :span[team]{.highlight-text.base} and contribute to your projects with my skills and enthusiasm.

```

```html

<p>
    I can be a valuable asset to
    <span class="highlight-text secondary" style="position: relative; display: inline-block; color: rgb(185, 122, 82); font-weight: 600;">
        your
    </span> 
    <span class="highlight-text base" style="position: relative; display: inline-block; color: rgb(57, 57, 55); font-weight: 600;">
        team
    </span> 
    and contribute to your projects with my skills and enthusiasm.
</p>

```

> Using Directives: Block Quote => Use the normal markdown notation or the `blockquote` tag

- By default, the left bar will be with base color and there isn't a highlighted background color
- Use the normal markdown notation will apply the default configurations only
- Use the blockquote tag to add more customizations
  - Use the class `blockquote` to apply the effects
  - Add the class `secondary` to make the left bar with the secondary color
  - Add the class `highlight-background` to make a highlighted background color with the specified color class or the default base one

```markdown

## With Base Color

> Hello every one

:blockquote[Hello Every One]{.highlight-background}

## With Secondary Color

:blockquote[Hello Every One]{.secondary}
:blockquote[Hello Every One]{.secondary.highlight-background}

```

Into

```html

<blockquote style="padding-left: 1rem; position: relative; margin: 1rem 0px; background-color: rgb(237, 238, 230);">
    <div style="position: absolute; left: 0px; height: 100%; top: 0px; background-color: rgb(137, 137, 132); width: 5px;"></div>
    <p>Hello every one</p>
</blockquote>
<p>
    <blockquote class="highlight-background" style="padding-left: 1rem; position: relative; margin: 1rem 0px; background-color: rgb(212, 213, 205);">
        <div style="position: absolute; left: 0px; height: 100%; top: 0px; background-color: rgb(137, 137, 132); width: 5px;"></div>
        Hello Every One
    </blockquote>
</p>
<p>
    <blockquote class="secondary" style="padding-left: 1rem; position: relative; margin: 1rem 0px; background-color: rgb(237, 238, 230);">
        <div style="position: absolute; left: 0px; height: 100%; top: 0px; background-color: rgb(185, 122, 82); width: 5px;"></div>
        Hello Every One
    </blockquote>
</p>
<p>
    <blockquote class="secondary highlight-background" style="padding-left: 1rem; position: relative; margin: 1rem 0px; background-color: rgb(237, 207, 188);">
        <div style="position: absolute; left: 0px; height: 100%; top: 0px; background-color: rgb(185, 122, 82); width: 5px;"></div>
        Hello Every One
    </blockquote>
</p>

```

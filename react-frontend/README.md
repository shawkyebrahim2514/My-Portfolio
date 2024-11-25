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

> Links => Normal markdown notations

- The normal syntax `[Text](Link)` will be rendered as a text with an icon bext to it
- The syntax `[[Text]](Link)` will be rendered as a lnik button with the text inside it

```markdown

[Google](https://google.com)

---

[[Google]](https://google.com)

```

Into

```html

<p>
    <div style="display: inline-block; align-items: center; gap: 0.5rem;">
        <h3 tabindex="0" style="display: inline; margin-right: 0.5rem; cursor: pointer;">Google</h3>
        <h3 tabindex="0" style="display: inline-block; cursor: pointer;">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up-right-from-square" class="svg-inline--fa fa-arrow-up-right-from-square fa-sm " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg>
        </h3>
    </div>
</p>

<p>
    <div class="css-1n6xck9">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="link" class="svg-inline--fa fa-link " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"></path></svg>
        Google
    </div>
</p>

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

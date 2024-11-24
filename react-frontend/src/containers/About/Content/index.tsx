/** @jsxImportSource @emotion/react */

import { useMediaQuery } from 'react-responsive';
import ResumeButton from './ResumeButton';
import { CSSProperties, memo, useMemo } from 'react';
import { SanityAboutPage } from '../../../Types';
import { useThemeContext } from '../../../contexts/ThemeContext';
import HTMLMarkdown from '../../../components/HTMLMarkdown';

const mdString = `

## :span[Ex-SWE intern @Microsoft]{.highlight-area.secondary style="margin-bottom:1rem"}
# I'm Shawky Ebrahim
## :span[Ex-SWE intern @Microsoft]{.highlight-area.secondary}

---

I **can** be a valuable :span[asset]{.highlight-area} to your team and contribute to your projects with my skills and enthusiasm.

**!Text!**
__!Text!__
~~!Text!~~

---

I can be a valuable asset to :span[your]{.highlight-text.secondary} :span[team]{.highlight-text.base} and contribute to your projects with my skills and enthusiasm.
Please don't hesitate to check out my resume or reach out on the contact's page.

---

Hello I 'm shawky ebrahim

---

- First Level
  - First First Level
  - Firest Second Level
- Second Level

---

> [!secondary highlight] This is an info
> > [!highlight] Hello World

> [!highlight] This is an info
> Hello ***SHawky*** Ebrahim

> [!base] This is an info
> Hello SHawky Ebrahim

> [!secondary] This is an info
> Hello SHawky Ebrahim

> [!popup] This is an info
> > [!popup] I Love you so
> > **!There are some benefits from it like:!**
> > - The first Sectino
> ---
> > [!popup] I Love you so **much** guy!
>
> Hola Hola Hola

> Hello Every One Here!

Hello **Shawky** **!Ebrahim!** **-Ahmed-** **!-Mahmoud-!** 

Hello **-Shawky-** **!-Ebrahim-!** 

Hello **Shawky** **!Ebrahim!** 

`;

function Content({
    description,
    resume,
}: Readonly<Omit<SanityAboutPage, 'personImage'>>) {
    const isMediumScreen = useMediaQuery({ query: '(max-width: 1124px)' });
    const { theme } = useThemeContext();
    const containerStyle = useMemo((): CSSProperties => ({
        fontSize: "1.2rem",
        color: theme.colors.base[700],
        textAlign: isMediumScreen ? "center" : "left",
    }), [isMediumScreen, theme.colors.base]);

    return (
        <div style={containerStyle}>
            <HTMLMarkdown markdown={mdString} />
            <ResumeButton resume={resume} />
        </div>
    )
}

export default memo(Content);

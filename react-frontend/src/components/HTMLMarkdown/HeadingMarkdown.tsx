import styles from './HTMLMarkdown.module.css';

type HeadingMarkdownProps = React.HTMLAttributes<HTMLHRElement> & {
    headingNumber: "one" | "two" | "three" | "four" | "five" | "six",
}

const headingClass: Record<HeadingMarkdownProps["headingNumber"], string> = {
    one: styles.h1,
    two: styles.h2,
    three: styles.h3,
    four: styles.h4,
    five: styles.h5,
    six: styles.h6,
}

const HeadingMarkdown = ({ headingNumber, children, ...props }: HeadingMarkdownProps) => {
    const HTMLHeadings: Record<HeadingMarkdownProps["headingNumber"], React.JSX.Element> = {
        one: <h1 {...props} className={headingClass.one}>{children}</h1>,
        two: <h2 {...props} className={headingClass.two}>{children}</h2>,
        three: <h3 {...props} className={headingClass.three}>{children}</h3>,
        four: <h4 {...props} className={headingClass.four}>{children}</h4>,
        five: <h5 {...props} className={headingClass.five}>{children}</h5>,
        six: <h6 {...props} className={headingClass.six}>{children}</h6>,
    }

    return HTMLHeadings[headingNumber];
}

export default HeadingMarkdown
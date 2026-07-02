import { cx } from '../../utils/cx';
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

const HeadingMarkdown = ({ headingNumber, children, className, ...props }: HeadingMarkdownProps) => {
    const merged = cx(headingClass[headingNumber], className);
    const HTMLHeadings: Record<HeadingMarkdownProps["headingNumber"], React.JSX.Element> = {
        one: <h1 {...props} className={merged}>{children}</h1>,
        two: <h2 {...props} className={merged}>{children}</h2>,
        three: <h3 {...props} className={merged}>{children}</h3>,
        four: <h4 {...props} className={merged}>{children}</h4>,
        five: <h5 {...props} className={merged}>{children}</h5>,
        six: <h6 {...props} className={merged}>{children}</h6>,
    }

    return HTMLHeadings[headingNumber];
}

export default HeadingMarkdown
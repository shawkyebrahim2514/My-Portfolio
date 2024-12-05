import { useThemeContext } from '../../contexts/ThemeContext';

type HeadingMarkdownProps = React.HTMLAttributes<HTMLHRElement> & {
    headingNumber: "one" | "two" | "three" | "four" | "five" | "six",
}

const HeadingMarkdown = ({ headingNumber, children, ...props }: HeadingMarkdownProps) => {
    const { theme } = useThemeContext();
    const HTMLHeadingStyles: Record<HeadingMarkdownProps["headingNumber"], React.CSSProperties> = {
        one: {
            fontSize: "3.8rem",
            fontWeight: 700,
            // color: theme.colors.base[800]
        },
        two: {
            fontSize: "2.2rem",
            fontWeight: 700,
            // color: theme.colors.base[800]
        },
        three: {
            fontSize: "1.8rem",
            fontWeight: 700,
            // color: theme.colors.base[800]
        },
        four: {
            fontSize: "1.4rem",
            fontWeight: 700,
            // color: theme.colors.base[800]
        },
        five: {
            fontSize: "1.2rem",
            fontWeight: 700,
            // color: theme.colors.base[800]
        },
        six: {
            fontSize: "1.1rem",
            color: theme.colors.base[800]
        }
    }
    const HTMLHeadings: Record<HeadingMarkdownProps["headingNumber"], JSX.Element> = {
        one:
            <h1 {...props}
                style={{
                    ...props.style,
                    ...HTMLHeadingStyles.one
                }}>
                {children}
            </h1>,
        two:
            <h2 {...props}
                style={{
                    ...props.style,
                    ...HTMLHeadingStyles.two
                }}>
                {children}
            </h2>,
        three:
            <h3 {...props}
                style={{
                    ...props.style,
                    ...HTMLHeadingStyles.three
                }}>
                {children}
            </h3>,
        four:
            <h4 {...props}
                style={{
                    ...props.style,
                    ...HTMLHeadingStyles.four
                }}>
                {children}
            </h4>,
        five:
            <h5 {...props}
                style={{
                    ...props.style,
                    ...HTMLHeadingStyles.five
                }}>
                {children}
            </h5>,
        six:
            <h6 {...props}
                style={{
                    ...props.style,
                    ...HTMLHeadingStyles.six
                }}>
                {children}
            </h6>,
    }

    return HTMLHeadings[headingNumber];
}

export default HeadingMarkdown
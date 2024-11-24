import { useThemeContext } from '../../contexts/ThemeContext';

type HeadingMarkdownProps = React.HTMLAttributes<HTMLHRElement> & {
    headingNumber: "one" | "two" | "three" | "four" | "five" | "six",
}

const HeadingMarkdown = ({ headingNumber, ...props }: HeadingMarkdownProps) => {
    const { theme } = useThemeContext();
    const HTMLHeadingStyles: Record<HeadingMarkdownProps["headingNumber"], React.CSSProperties> = {
        one: {
            fontSize: "3.8rem",
            fontWeight: 700,
            color: theme.colors.base[800]
        },
        two: {
            fontSize: "2.2rem",
            color: theme.colors.base[800]
        },
        three: {
            fontSize: "2rem"
        },
        four: {},
        five: {},
        six: {}
    }
    const HTMLHeadings: Record<HeadingMarkdownProps["headingNumber"], JSX.Element> = {
        one: <h1 {...props}
            style={{
                ...props.style,
                ...HTMLHeadingStyles.one
            }} />,
        two: <h2 {...props}
            style={{
                ...props.style,
                ...HTMLHeadingStyles.two
            }} />,
        three: <h3 {...props}
            style={{
                ...props.style,
                ...HTMLHeadingStyles.three
            }} />,
        four: <h4 {...props}
            style={{
                ...props.style,
                ...HTMLHeadingStyles.four
            }} />,
        five: <h5 {...props}
            style={{
                ...props.style,
                ...HTMLHeadingStyles.five
            }} />,
        six: <h6 {...props}
            style={{
                ...props.style,
                ...HTMLHeadingStyles.six
            }} />
    }

    return HTMLHeadings[headingNumber];
}

export default HeadingMarkdown
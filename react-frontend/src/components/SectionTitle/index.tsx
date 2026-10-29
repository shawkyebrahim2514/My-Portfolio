import Text from '../Text';
import TitleHighlightedText from './TitleHighlightedText';
import styles from './SectionTitle.module.css';

type SectionTitleProps = {
    readonly highlightedText?: string;
    readonly text?: string;
    readonly subtitle?: string;
    readonly style?: React.CSSProperties;
    readonly headingLevel?: 1 | 2;
};

export default function SectionTitle({
    highlightedText,
    text,
    subtitle,
    style,
    headingLevel = 1,
}: SectionTitleProps) {
    const accessibleTitle = [highlightedText, text].filter(Boolean).join(' ');
    const Heading = headingLevel === 1 ? 'h1' : 'h2';

    return (
        <header className={styles.container} style={style}>
            {/* The visible title is built from decorative, graphically-styled
                pieces; this single visually-hidden h1 gives each page one clear
                top-level heading for the assistive-tech document outline. */}
            {accessibleTitle && <Heading className="sr-only">{accessibleTitle}</Heading>}
            <div className={styles.title}>
                {highlightedText ? (
                    <TitleHighlightedText>{highlightedText}</TitleHighlightedText>
                ) : null}
                {text ? (
                    <Text variant={'h2'} as="span">
                        <span className={styles.text}>{text}</span>
                    </Text>
                ) : null}
            </div>
            {subtitle ? (
                <Text variant={'h3'} as="p">
                    {subtitle}
                </Text>
            ) : null}
        </header>
    );
}

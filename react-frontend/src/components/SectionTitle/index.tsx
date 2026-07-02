import Text from '../Text'
import TitleHighlightedText from './TitleHighlightedText';
import styles from './SectionTitle.module.css';

type SectionTitleProps = {
    readonly highlightedText?: string;
    readonly text?: string;
    readonly subtitle?: string;
    readonly style?: React.CSSProperties;
}

export default function SectionTitle({ highlightedText, text, subtitle, style }: SectionTitleProps) {
    const accessibleTitle = [highlightedText, text].filter(Boolean).join(' ');

    return (
        <header className={styles.container} style={style}>
            {/* The visible title is built from decorative, graphically-styled
                pieces; this single visually-hidden h1 gives each page one clear
                top-level heading for the assistive-tech document outline. */}
            {accessibleTitle && <h1 className="sr-only">{accessibleTitle}</h1>}
            <div className={styles.title}>
                {highlightedText ? <TitleHighlightedText>{highlightedText}</TitleHighlightedText> : null}
                {text ? <Text variant={"h2"}><span className={styles.text}>{text}</span></Text> : null}
            </div>
            {subtitle ? <Text variant={"h3"}>{subtitle}</Text> : null}
        </header>
    )
}
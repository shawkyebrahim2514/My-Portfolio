import ActualText from './ActualText';
import Shadow from './Shadow';
import Stroke from './Stroke';
import styles from './highlight.module.css';

function TitleHighlightedText({ children }: { readonly children: string }) {
    return (
        <div className={styles.highlight}>
            <Stroke />
            <Shadow />
            <ActualText text={children} />
        </div>
    );
}

export default TitleHighlightedText;